import { _decorator, Component } from 'cc';
import { Core } from '../Core';
import { CoreEvent } from '../core/events/CoreEvent';
const { ccclass, property } = _decorator;

/**
 * 使用者點擊Live列表選單
 *
 * @export
 * @class openLiveMenu
 * @extends {Component}
 */
@ccclass('openLiveMenu')
export class openLiveMenu extends Component {
    fire() {
        new Core().event.emit(CoreEvent.OPEN_LIVE_MENU);
    }
}