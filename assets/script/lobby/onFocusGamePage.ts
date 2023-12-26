import { _decorator, CCInteger, Component } from 'cc';
import { Core } from '../Core';
import { GUIEvent } from '../core/events/GUIEvent';
const { ccclass, property } = _decorator;

@ccclass('onFocusGamePage')
export class onFocusGamePage extends Component {

    @property({ type: CCInteger, tooltip: "id" })
    id: number;

    onFocus(id: number): void {
        if (this.id !== id) {
            return;
        }
        console.log('onFocusGamePage');
    }

    protected renderPage(): void {

    }

    start() {
        const core = new Core();
        core.event.on(GUIEvent.TRIGGER_FOCUS_PAGE, this.onFocus, this);

        this.renderPage();
    }

    protected onDestroy(): void {
        const core = new Core();
        core.event.off(GUIEvent.TRIGGER_FOCUS_PAGE, this.onFocus, this);
    }

    update(deltaTime: number) {

    }
}