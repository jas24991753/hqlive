import { _decorator, Component } from 'cc';
import { Core } from '../Core';
import { NativeEvent } from '../core/events/NativeEvent';
const { ccclass, property } = _decorator;

@ccclass('openCamera')
export class openCamera extends Component {
    fire() {
        new Core().event.emit(NativeEvent.JSB_OPEN_SELFIE_STREAMING);
    }
}

