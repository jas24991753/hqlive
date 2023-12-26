import { CCFloat, CCInteger, Component, EventTouch, Node, Size, Tween, UITransform, Vec2, Vec3, Widget, _decorator, screen, view } from 'cc';
import { Core } from '../../Core';
import { CoreEvent } from '../events/CoreEvent';
const { ccclass, property } = _decorator;

/**
 * 放大縮小處理
 *
 * @export
 * @class Resizer
 * @extends {Component}
 */
@ccclass('Resizer')
export class Resizer extends Component {

    @property(Node)
    display: Node;

    @property(CCFloat)
    scale: number = 1;

    @property({ type: CCInteger, tooltip: "衰減比率,0~1" })
    friction: number = 0.9;

    @property({ type: CCInteger, tooltip: "速度X放大比率" })
    scaleVX: number = 15;

    @property({ type: CCInteger, tooltip: "速度Y放大比率" })
    scaleVY: number = 15;

    private _isDragging = false;

    private _startTime: number;
    private _startPoint: Vec2;

    private _vx: number = 0;
    private _vy: number = 0;

    private _fullscreen = true;

    private _size: Size;
    private _originalSize: Size;

    start() {
        const core = new Core();
        core.event.on(CoreEvent.SET_FLOAT_GAME_DISPLAY, this.setFloatGameDisplay, this);

        console.log('screen.windowSize', screen.windowSize);
        console.log('screen.getVisibleSize', view.getVisibleSize());
    }

    protected onDestroy(): void {
        const core = new Core();
        core.event.off(CoreEvent.SET_FLOAT_GAME_DISPLAY, this.setFloatGameDisplay, this);
    }

    setFloatGameDisplay(): void {
        window.application.store.isFloat = true;
        this.triggerMinimizeGame();
        this._fullscreen = false;
    }

    setDefaultGameDisplay(): void {
        window.application.store.isFloat = false;

        this.triggerMaximizeGame();
        this._fullscreen = true;
    }

    triggerMaximizeGame(): void {
        const widget = this.node.getComponent(Widget);
        widget.enabled = true;
        const dwidget = this.display.getComponent(Widget);
        dwidget.enabled = true;

        if (this._originalSize) {
            this.node.getComponent(UITransform).setContentSize(this._originalSize);
            this.display.getComponent(UITransform).setContentSize(this._originalSize);
        }

        this.display.scale = new Vec3(1, 1, 1);
        this.node.setPosition(new Vec3(0, 0, 0));

        this.deepUpdateWidget(this.node);

        this.node.off(Node.EventType.TOUCH_START, this.onDragBegin, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onDragMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onDragEnd, this);
    }

    deepUpdateWidget(node: Node) {
        const widget = node.getComponent(Widget);
        if (widget && widget.enabled) {
            widget.updateAlignment();
        }

        if (node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                this.deepUpdateWidget(node.children[i]);
            }
        }
    }

    triggerMinimizeGame(): void {
        const csize = this.node.getComponent(UITransform).contentSize;
        const size = new Size(csize.width, csize.height);
        const scaledSize = new Size(size.width * this.scale, size.height * this.scale);
        this._originalSize = size;

        // 禁用對齊工具才有辦法拖拉元件,與調整元件大小
        const widget = this.node.getComponent(Widget);
        const dwidget = this.display.getComponent(Widget);
        widget.enabled = false;
        dwidget.enabled = false;

        this.node.getComponent(UITransform).setContentSize(scaledSize);

        this.display.scale = new Vec3(this.scale, this.scale, this.scale);
        this.display.getComponent(UITransform).setContentSize(scaledSize);

        this.node.on(Node.EventType.TOUCH_START, this.onDragBegin, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onDragMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onDragEnd, this);

        this._size = this.node.getComponent(UITransform).contentSize;
        this.deepUpdateWidget(this.node);

        this.node.getComponent(UITransform).setContentSize(scaledSize);
        this.display.getComponent(UITransform).setContentSize(scaledSize);

    }

    private checkOutOfBound(): { isOut: boolean, top: boolean, right: boolean, down: boolean, left: boolean } {
        const wp = this.node.getWorldPosition();
        const bound = {
            isOut: false,
            top: false,
            right: false,
            down: false,
            left: false,
        }

        console.log('check', this._size);

        if (wp.x + this._size.width / 2 >= (view.getVisibleSize().width - 20)) {
            bound.right = true;
            bound.isOut = true;
        }
        if (wp.x - this._size.width / 2 <= 20) {
            bound.left = true;
            bound.isOut = true;
        }

        if (wp.y + this._size.height / 2 >= view.getVisibleSize().height - 80) {
            bound.top = true;
            bound.isOut = true;
        }
        if (wp.y - this._size.height / 2 <= 0) {
            bound.down = true;
            bound.isOut = true;
        }
        return bound;
    }

    private bouceBack(bound: { isOut: boolean, top: boolean, right: boolean, down: boolean, left: boolean }): void {

        const tween = new Tween(this.node);
        let position = this.node.position;
        const wp = this.node.getWorldPosition();

        let diffY = 0;
        let diffX = 0;
        if (bound.top) {
            const diff = wp.y + this._size.height / 2 - view.getVisibleSize().height;
            diffY = - diff - 80;
        }

        if (bound.down) {
            const diff = wp.y - this._size.height / 2;
            diffY = - diff + 10;
        }

        if (bound.left) {
            const diff = wp.x - this._size.width / 2 - 20;
            diffX = - diff + 10;
        }

        if (bound.right) {
            const diff = wp.x + this._size.width / 2 - view.getVisibleSize().width;
            console.log(diff);
            diffX = - diff - 30;
        }

        const newP = new Vec3(position.x + diffX, position.y + diffY, 0);

        tween
            .to(0.3, { position: newP })
        tween.start();
    }

    onDragBegin(e: EventTouch): void {
        if (this._fullscreen) {
            return;
        }
        this._isDragging = true;
        const transform = this.getComponent(UITransform);
        this._startTime = Date.now();
        this._startPoint = e.touch.getLocation();
    }

    onDragMove(e: EventTouch): void {
        if (!this._isDragging) {
            return;
        }
        let p = this.node.getPosition();
        p = p.add(new Vec3(e.touch.getUIDelta().x, e.touch.getUIDelta().y, 0));
        this.node.setPosition(p);
    }

    onDragEnd(e: EventTouch): void {
        if (this._fullscreen) {
            return;
        }

        const dx = e.getLocationX() - this._startPoint.x;
        const dy = e.getLocationY() - this._startPoint.y;

        if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
            // 試為點擊,取消漂浮模式
            new Core().event.emit(CoreEvent.SET_NON_FLOAT_GAME_DISPLAY);
            this.setDefaultGameDisplay();
            return;
        }

        this._isDragging = false;

        const bound = this.checkOutOfBound();

        if (bound.isOut) {
            this.bouceBack(bound);
            return;
        }


        const dt = Date.now() - this._startTime;

        this._vx = (dx / dt) * this.scaleVX;
        this._vy = (dy / dt) * this.scaleVY;
    }

    update(deltaTime: number) {
        if (Math.abs(this._vx) < 0.1 && Math.abs(this._vy) < 0.1) {
            return;
        }
        this._vx *= this.friction;
        this._vy *= this.friction;

        let p = this.node.getPosition();

        p = p.add(new Vec3(this._vx * deltaTime, this._vy * deltaTime, 0));
        this.node.setPosition(p);
    }
}


