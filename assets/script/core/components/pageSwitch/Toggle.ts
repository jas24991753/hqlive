import { _decorator } from 'cc';
import { Core } from '../../../Core';
import { Direction } from '../../enum/Direction';
import { GUIEvent } from '../../events/GUIEvent';
import { PageSwitch } from './PageSwitch';
const { ccclass, property } = _decorator;
/**
 * 切頁處理的效果, 單純on/off
 *
 * @export
 * @class Toggle
 * @extends {PageSwitch}
 */
@ccclass('Toggle')
export class Toggle extends PageSwitch {
    focus(index: number, direction: Direction): void {
        const node = this.node.children[index];
        node.active = true;
        const core = new Core();
        core.event.emit(GUIEvent.TRIGGER_FOCUS_PAGE, this.data[index]);
    }

    unfocus(index: number, direction: Direction): void {
        const node = this.node.children[index];
        node.active = false;
    }
}

