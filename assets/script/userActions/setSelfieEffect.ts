import { _decorator } from 'cc';
import { BaseComponent } from '../core/components/BaseComponent';
import { NativeEvent } from '../core/events/NativeEvent';
const { ccclass, property } = _decorator;

@ccclass('setSelfieEffect')
export class setSelfieEffect extends BaseComponent {
    fire(event, data) {
        this.event.emit(NativeEvent.JSB_SET_SELFIE_EFFECT, data);
    }
}