import { Node, UITransform, Widget, _decorator } from 'cc';
import { Core } from '../../Core';
import { Store } from '../../core/Store';
import { Resizer } from '../../core/app/Resizer';
import { BaseComponent } from '../../core/components/BaseComponent';
import { CoreEvent } from '../../core/events/CoreEvent';
import { NativeEvent } from '../../core/events/NativeEvent';
import { deepUpdateWidget } from '../../utils/cocos/deepUpdateWidget';
const { ccclass, property } = _decorator;
/**
 * 負責live/game呈現方式
 *
 * @export
 * @class DisplayHandler
 * @extends {Component}
 */
@ccclass('DisplayHandler')
export class DisplayHandler extends BaseComponent {

    @property({ type: Node, tooltip: "遊戲漂浮按鈕" })
    minimizeButton: Node;

    store: Store;

    /** live模式, 遮蔽面板上方的動畫表演 */
    setNoAnimationDisplay(): void {
        console.log('關閉動畫');
        const ui = this.node.getComponent(UITransform);
        const widget = this.node.getComponent(Widget);
        widget.isAlignTop = false;
        widget.isAlignBottom = true;
        widget.top = undefined;
        widget.bottom = 0;
        const size = ui.contentSize;
        ui.setContentSize(size.width, 640);
        deepUpdateWidget(this.node);

        if (this.minimizeButton) {
            this.minimizeButton.active = true;
        }
    }

    setDefaultDisplay(): void {
        const resizer = this.node.getComponent(Resizer);
        if (resizer) {
            resizer.triggerMaximizeGame();
        }

        const ui = this.node.getComponent(UITransform);
        const widget = this.node.getComponent(Widget);
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.bottom = 0;
        widget.top = 0;
        const size = ui.contentSize;
        ui.setContentSize(size.width, 1280);
        deepUpdateWidget(this.node);

        if (this.minimizeButton) {
            this.minimizeButton.active = false;
        }

    }

    onSwap(): void {
        if (this.store.isLiveStreaming && this.store.focusTarget === 'live') {
            this.setDefaultDisplay();
            this.store.focusTarget = 'game';
            new Core().event.emit(CoreEvent.FOCUS_GAME);
            new Core().event.emit(NativeEvent.JSB_OPEN_LIVE_STREAMING, 'floating');
        } else if (this.store.isLiveStreaming && this.store.focusTarget === 'game') {
            this.setNoAnimationDisplay();
            this.store.focusTarget = 'live';
            new Core().event.emit(NativeEvent.JSB_OPEN_LIVE_STREAMING);
        }
    }

    onFocusLive(): void {
        this.setNoAnimationDisplay();
    }

    start() {
        this.event.on(CoreEvent.SWAP, this.onSwap, this);
        this.event.on(CoreEvent.FOCUS_LIVE, this.onFocusLive, this);

        this.store = window.application.store;

        if (this.store.isLiveStreaming && this.store.focusTarget === 'live') {
            this.setNoAnimationDisplay();
        }

        if (this.store.focusTarget === 'game') {
            this.setDefaultDisplay();
        }
    }

    protected onDestroy(): void {
        this.event.off(CoreEvent.SWAP, this.onSwap, this);
        this.event.off(CoreEvent.FOCUS_LIVE, this.onFocusLive, this);
    }

    update(deltaTime: number) {

    }
}

