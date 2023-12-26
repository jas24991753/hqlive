import { Node, Prefab, Sprite, SpriteFrame, _decorator, instantiate, resources } from 'cc';
import { BaseComponent } from '../core/components/BaseComponent';
import { VerticalItemAligner } from '../core/components/VerticalItemAligner';
import { CoreEvent } from '../core/events/CoreEvent';
import { NativeEvent } from '../core/events/NativeEvent';
const { ccclass, property } = _decorator;

@ccclass('LiveMenu')
export class LiveMenu extends BaseComponent {

    @property({ type: Node, tooltip: "menu的主要節點" })
    menu: Node;

    @property({ type: Prefab, tooltip: "要顯示在menu中的元件" })
    liveItem: Prefab = null;

    data: any[];

    @property({ type: VerticalItemAligner })
    liveItems: VerticalItemAligner = null;

    start() {
        this.node.active = false;
        this.event.on(CoreEvent.OPEN_LIVE_MENU, this.open, this);
        this.event.on(CoreEvent.APP_LIVE_STREAMING_OPENED, this.hide, this);
    }

    protected onDestroy(): void {
        this.event.off(CoreEvent.OPEN_LIVE_MENU, this.open, this);
        this.event.off(CoreEvent.APP_LIVE_STREAMING_OPENED, this.hide, this);
    }

    /** 載入遊戲介紹列表 */
    load(): Promise<any> {
        const array = ['001', '002', '003', '005', '006'].map((item) => `live/example/${item}/spriteFrame`);

        let promises = [];

        for (let i = 0; i < array.length; i++) {

            const p = new Promise((resolve) => {
                resources.load(array[i], SpriteFrame, (err, asset) => {
                    resolve(asset);
                });

            });
            promises.push(p);
        }

        return Promise.all(promises);
    }

    open() {
        this.load().then((data) => { this.render(data) });
        // const height = this.menu.getComponent(UITransform).height;

        // setPositionY(this.menu, -height);

        // const tween = new Tween(this.menu);
        // tween
        //     .to(0.2, { position: new Vec3(0, 0, 0) }, { easing: "expoOut" })
        // tween.start();

        this.node.active = true;
    }

    hide() {
        this.node.active = false;

        // const height = this.menu.getComponent(UITransform).height;

        // const tween = new Tween(this.menu);
        // tween
        //     .to(0.2, { position: new Vec3(0, -height, 0) }, {
        //         easing: "expoOut", onComplete: () => {
        //             this.node.active = false;
        //         }
        //     })
        // tween.start();

    }

    loadLive(): void {
        this.event.emit(NativeEvent.JSB_OPEN_LIVE_STREAMING, "floating");
        this.node.active = false;
    }

    render(data: any[]) {

        let objs = [];
        for (let i = 0; i < data.length; i++) {
            const output = {
                spriteFrame: data[i],
                prefab: instantiate(this.liveItem)
            };

            const sprite = output.prefab.getChildByName('Sprite').getComponent(Sprite);
            sprite.spriteFrame = output.spriteFrame;
            output.prefab.on(Node.EventType.TOUCH_END, this.loadLive, this);

            objs.push(output);
        }

        this.liveItems.load(objs);
    }
}