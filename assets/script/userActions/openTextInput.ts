import { _decorator, Component } from 'cc';
import { Core } from '../Core';
import { CoreEvent } from '../core/events/CoreEvent';
import { NativeEvent } from '../core/events/NativeEvent';
const { ccclass, property } = _decorator;

@ccclass('openTextInput')
export class OpenTextInput extends Component {
    fire() {
        new Core().event.emit(NativeEvent.JSB_OPEN_TEXT_INPUT);
    }
}