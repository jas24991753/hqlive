import { Component, _decorator } from 'cc';

import { Core } from '../../Core';
import { SlotEvent } from '../SlotEvent';
const { ccclass } = _decorator;

@ccclass('triggerSpin')
export class triggerSpin extends Component {
    fire() {
        new Core().event.emit(SlotEvent.TRIGGER_SPIN);
    }
}

