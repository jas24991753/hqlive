import { _decorator, Component } from 'cc';
import { Core } from '../Core';
import { LiveEvent } from '../live/LiveEvent';
const { ccclass, property } = _decorator;

@ccclass('openEffectMenu')
export class openEffectMenu extends Component {
    fire() {
        new Core().event.emit(LiveEvent.OPEN_EFFECT_MENU);
    }
}

