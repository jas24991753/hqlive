import { _decorator, Component } from 'cc';
import { Core } from '../Core';
import { CoreEvent } from '../core/events/CoreEvent';
const { ccclass, property } = _decorator;

/**
 * 將當前遊戲設為飄浮狀態
 *
 * @export
 * @class setFloatDisplay
 * @extends {Component}
 */
@ccclass('setFloatDisplay')
export class setFloatDisplay extends Component {

    start() {
        new Core().event.on(CoreEvent.SET_NON_FLOAT_GAME_DISPLAY, this.setVisible, this);
    }

    protected onDestroy(): void {
        const core = new Core();
        core.event.off(CoreEvent.SET_NON_FLOAT_GAME_DISPLAY, this.setVisible, this);
    }

    setVisible(): void {
        this.node.active = true;
    }

    fire() {
        this.node.active = false;
        new Core().event.emit(CoreEvent.SET_FLOAT_GAME_DISPLAY);
    }
}

