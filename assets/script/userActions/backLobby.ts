import { _decorator, Component, director } from 'cc';
import { Core } from '../Core';
import { NativeEvent } from '../core/events/NativeEvent';
const { ccclass, property } = _decorator;

/**
 * 使用者點擊返回按鈕
 *
 * @export
 * @class backLobby
 * @extends {Component}
 */
@ccclass('backLobby')
export class backLobby extends Component {
    fire() {
        new Core().event.emit(NativeEvent.JSB_BACK_LOBBY);
        director.loadScene("Main", () => { });
    }
}


