import { _decorator, CCInteger, Component } from 'cc';
import { Core } from '../Core';
import { GUIEvent } from '../core/events/GUIEvent';
const { ccclass, property } = _decorator;

@ccclass('onFocusLivePage')
export class onFocusLivePage extends Component {

    @property({ type: CCInteger, tooltip: "id" })
    id: number;

    onFocus(id: number): void {
        if (this.id !== id) {
            return;
        }
    }

    start() {
        const core = new Core();
        core.event.on(GUIEvent.TRIGGER_FOCUS_PAGE, this.onFocus, this);
    }

    protected onDestroy(): void {
        const core = new Core();
        core.event.off(GUIEvent.TRIGGER_FOCUS_PAGE, this.onFocus, this);
    }

    update(deltaTime: number) {

    }
}

