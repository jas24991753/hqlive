import { _decorator, Component } from 'cc';
import { Core } from '../Core';
import { CoreEvent } from '../core/events/CoreEvent';
const { ccclass, property } = _decorator;

/**
 * 使用者在live/game中切換主要視窗
 *
 * @export
 * @class swap
 * @extends {Component}
 */
@ccclass('swap')
export class swap extends Component {
    fire() {
        new Core().event.emit(CoreEvent.SWAP);
    }
}

