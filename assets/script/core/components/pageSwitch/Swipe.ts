import { _decorator, Tween, UITransform, Vec3 } from 'cc';
import { Core } from '../../../Core';
import { setPositionX } from '../../../utils/cocos/setPositionX';
import { Direction } from '../../enum/Direction';
import { GUIEvent } from '../../events/GUIEvent';
import { PageSwitch } from './PageSwitch';
const { ccclass, property } = _decorator;
/**
 * 切頁處理的效果, 左右滑動
 *
 * @export
 * @class Swipe
 * @extends {PageSwitch}
 */
@ccclass('Swipe')
export class Swipe extends PageSwitch {
    focus(index: number, direction: Direction): void {
        const node = this.node.children[index];
        node.active = true;
        const width = node.getComponent(UITransform).width;
        const offset = (direction === Direction.LEFT) ? width : -width;
        setPositionX(node, offset);

        const tween = new Tween(node);
        tween
            .to(0.5, { position: new Vec3(0, 0, 0) })
        tween.start();

        const core = new Core();
        core.event.emit(GUIEvent.TRIGGER_FOCUS_PAGE, this.data[index]);
    }

    unfocus(index: number, direction: Direction): void {
        // prev
        const node = this.node.children[index];
        const width = node.getComponent(UITransform).width;
        const tween = new Tween(node);

        const offset = (direction === Direction.LEFT) ? -width : width;

        tween
            .to(0.5, { position: new Vec3(offset, 0, 0) }, {
                onComplete: () => {
                    node.active = false;
                }
            })
        tween.start();
    }
}

