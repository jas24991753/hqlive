import { CCFloat, Component, EventTouch, Node, Prefab, Sprite, SpriteFrame, Tween, UITransform, Vec2, _decorator, instantiate, resources, view } from 'cc';
import { setPositionX } from '../../utils/cocos/setPositionX';
const { ccclass, property } = _decorator;

@ccclass('BannerView')
export class BannerView extends Component {

    private _curIndex: number = 0;

    private _elements: { [key: string]: SpriteFrame } = {};

    itemWidth: number = 100;

    @property({ type: Node })
    content: Node = null;

    @property({ type: Prefab })
    bannerItem: Prefab = null;

    @property({ type: CCFloat, tooltip: "輪播時間,單位:秒" })
    interval: number = 2;

    gap: number = 20;

    private _curNode: Node;
    private _nextNode: Node;
    private _startPoint: Vec2;
    private _dirty: boolean;
    private tick = 0;
    private _isPlaying = false;
    private _bannerData: string[] = [];

    load(array: string[]): Promise<void[]> {
        const promises = array.map((filename) => {
            return new Promise<void>((resolve) => {
                resources.load(`components/banners/${filename}/spriteFrame`, SpriteFrame, (err, asset) => {
                    this._elements[filename] = asset;
                    resolve();
                });
            });
        });

        return Promise.all(promises);
    }

    renderItem(array: string[]): void {
        // render current
        let node = instantiate(this.bannerItem);
        const sprite = node.getChildByName('Sprite').getComponent(Sprite);
        sprite.spriteFrame = this._elements[array[0]];
        this.content.addChild(node);
        this._curNode = node;

        // render next
        let nextnode = instantiate(this.bannerItem);
        const nextsprite = nextnode.getChildByName('Sprite').getComponent(Sprite);
        nextsprite.spriteFrame = this._elements[array[0]];
        this.content.addChild(nextnode);
        this._nextNode = nextnode;
        this._dirty = true;
    }

    renderNext(): void {
        const nextsprite = this._nextNode.getChildByName('Sprite').getComponent(Sprite);
        nextsprite.spriteFrame = this._elements[this._bannerData[this._curIndex]];
    }

    next(): void {
        this._curIndex += 1;
        if (this._curIndex > Object.keys(this._elements).length - 1) {
            this._curIndex = 0;
        }
        this.renderNext();
        this.slide('next');
    }

    prev(): void {
        this._curIndex -= 1;
        if (this._curIndex <= 0) {
            this._curIndex = Object.keys(this._elements).length - 1;
        }
        this.renderNext();
        this.slide('prev');
    }

    slide(direction: 'next' | 'prev'): void {
        const obj = { width: this.itemWidth };
        const tween = new Tween(obj);

        const sign = direction === 'next' ? -1 : 1;

        if (direction === 'next') {
            setPositionX(this._nextNode, this.itemWidth + this.gap);
        }

        if (direction === 'prev') {
            setPositionX(this._nextNode, -this.itemWidth - this.gap);
        }
        this._nextNode.active = true;
        const x = this._curNode.position.x;
        const nx = this._nextNode.position.x;
        this._isPlaying = true;
        tween
            .to(0, { width: 0 }, {
                onUpdate: (target, ratio) => {
                    const value = x + sign * ratio * (this.itemWidth + this.gap);
                    setPositionX(this._curNode, value);
                    setPositionX(this._nextNode, nx + value);
                },
                onComplete: () => {
                    this._isPlaying = false;
                    const tmp = this._nextNode;
                    this._nextNode = this._curNode;
                    this._curNode = tmp;
                    this._nextNode.active = false;
                    this.onSliceCompleted();
                }
            })
        tween.start();
    }

    onSliceCompleted(): void {
    }

    start() {
        const array = ['banner1', 'banner2', 'banner3', 'banner4'];

        this._bannerData = array;

        this.load(array).then(() => {
            this.renderItem(array);
        });

        this.itemWidth = this.node.getComponent(UITransform).width;
        this.gap = (view.getVisibleSize().width - this.itemWidth) / 2;
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchCancel, this);

    }

    trigger() {
        this.next();
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.touchCancel, this);

    }

    private handleTouch(e: EventTouch): void {
        if (this._isPlaying) {
            return;
        }
        const now = e.touch.getLocation();
        this.unschedule(this.trigger);
        if (Math.abs(now.x - this._startPoint.x) <= 5 && Math.abs(now.y - this._startPoint.y) <= 5) {
            // 原地點擊
            console.log('click');
            this.next();
        } else if (now.x - this._startPoint.x > 0) {
            // 往右滑
            this.prev();
            console.log('right');
        } else if (now.x - this._startPoint.x < 0) {
            // 往左滑
            this.next();
            console.log('left');
        }
    }

    touchStart(e: EventTouch): void {
        this._startPoint = e.touch.getLocation();
    };


    touchCancel(e: EventTouch): void {
        this.handleTouch(e);
    }

    touchEnd(e: EventTouch): void {
        this.handleTouch(e);
    }

    protected lateUpdate(dt: number): void {
        if (this._dirty) {
            if (this.tick == 2) {
                setPositionX(this._nextNode, this.itemWidth + this.gap);
                this._dirty = false;
            }
            this.tick++;
        }
    }

    update(deltaTime: number) {

    }
}

