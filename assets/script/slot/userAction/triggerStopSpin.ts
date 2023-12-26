import { _decorator, Component } from 'cc';
import { Core } from '../../Core';
import { SlotEvent } from '../SlotEvent';
const { ccclass, property } = _decorator;

@ccclass('triggerStopSpin')
export class triggerStopSpin extends Component {
    fire() {
        new Core().event.emit(SlotEvent.TRIGGER_STOP_SPIN);
    }
}

