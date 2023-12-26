import { _decorator, CCBoolean, CCInteger, Color, Component, Label, Node, Tween } from 'cc';
import { Core } from '../../../Core';
import { GUIEvent } from '../../events/GUIEvent';
const { ccclass, property } = _decorator;

/**
 * 純文字型頁籤切換效果
 *
 * @export
 * @class FontTab
 * @extends {Component}
 */
@ccclass('FontTab')
export class FontTab extends Component {

    private _curIndex: number = 0;

    @property({ type: CCInteger, tooltip: "對應的換頁容器id" })
    pair: number = 0;

    @property({ type: CCBoolean })
    focusBold: boolean = true;

    @property({ type: CCInteger })
    focusFontSize: number = 28;

    @property({ type: Color })
    focusColor: Color;

    @property({ type: CCInteger })
    defaultFontSize: number = 24;

    @property({ type: Color })
    defaultColor: Color;

    protected onDestroy(): void {

    }

    unfocus(index): void {
        const node = this.node.children[index];
        const label = node.getComponent(Label);
        label.isBold = false;
        label.fontSize = this.defaultFontSize;
        label.color = this.defaultColor;
    }

    focus(index: number, duration = 0): void {
        const node = this.node.children[index];
        const label = node.getComponent(Label);

        label.isBold = this.focusBold;
        label.color = this.focusColor;

        const obj = { size: this.defaultFontSize };

        const tween = new Tween(obj);
        tween
            .to(duration, { size: this.focusFontSize }, {
                onUpdate: (target, ratio) => {
                    label.fontSize = this.defaultFontSize + (this.focusFontSize - this.defaultFontSize) * ratio;
                }
            })
        tween.start();
        // label.fontSize = this.focusFontSize;
    }

    reset(): void {

    }

    start() {
        this.node.children.forEach((node, index) => {
            node.on(Node.EventType.TOUCH_END, this.goTo.bind(this, index), this);

            const label = node.getComponent(Label);

            if (index === window.application.store.focusTabIndex) {
                label.isBold = this.focusBold;
                label.fontSize = this.focusFontSize;
                label.color = this.focusColor;
            } else {
                label.fontSize = this.defaultFontSize;
                label.color = this.defaultColor;
            }
        });
    }

    goTo(index: number): void {

        const prev = this._curIndex;

        this.focus(index, 0.1);

        this.node.children.forEach((node, i) => {
            if (i !== index) {
                this.unfocus(i);
            }
        })

        this._curIndex = index;
        const core = new Core();
        core.event.emit(GUIEvent.TRIGGER_SWITCH_TAB, { pair: this.pair, current: index, prev });
    }

    update(deltaTime: number) {

    }
}

