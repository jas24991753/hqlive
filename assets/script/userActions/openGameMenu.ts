import { _decorator, Component } from 'cc';
import { Core } from '../Core';
import { CoreEvent } from '../core/events/CoreEvent';
const { ccclass, property } = _decorator;

/**
 * 使用者點擊遊戲列表選單
 *
 * @export
 * @class openGameMenu
 * @extends {Component}
 */
@ccclass('openGameMenu')
export class openGameMenu extends Component {
    fire() {
        new Core().event.emit(CoreEvent.OPEN_GAME_MENU);
    }
}