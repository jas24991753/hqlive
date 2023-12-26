import { _decorator, CCInteger, Component } from 'cc';
import { Core } from '../../../Core';
import { Direction } from '../../enum/Direction';
import { GUIEvent } from '../../events/GUIEvent';
const { ccclass, property } = _decorator;

@ccclass('PageSwitch')
export abstract class PageSwitch extends Component {

    protected abstract focus(index: number, direction: Direction): void;
    protected abstract unfocus(index: number, direction: Direction): void;

    @property({ type: CCInteger, tooltip: "對應的頁籤切換器id" })
    pair: number = 0;

    @property({ type: [CCInteger], tooltip: "每個分頁的對應id" })
    data: Number[] = new Array<number>();

    private _curIndex: number = 0;

    public get curIndex(): number {
        return this._curIndex;
    }

    public onSwitchTo: Function;

    start() {
        const core = new Core();
        core.event.on(GUIEvent.TRIGGER_SWITCH_TAB, this.triggerSwitchTab, this);
        this._curIndex = window.application.store.focusTabIndex;
        this.node.children.forEach((node, index) => {
            if (index !== this._curIndex) {
                node.active = false;
            }
        });
    }

    protected onDestroy(): void {
        const core = new Core();
        core.event.off(GUIEvent.TRIGGER_SWITCH_TAB, this.triggerSwitchTab, this);
    }

    update(deltaTime: number) {

    }

    triggerSwitchTab(data: { pair: number, current: number, prev: number }): void {
        if (this.pair !== data.pair || !this.node.children[data.current]) {
            return;
        }

        const direction: Direction = data.current > data.prev ? Direction.LEFT : Direction.RIGHT;
        this.node.children.forEach((node, index) => {
            if (index === data.current) {
                this.focus(index, direction);
                if (this.onSwitchTo) {
                    this.onSwitchTo(index);
                }
            } else {
                this.unfocus(index, direction);
            }
        });
    }
}

