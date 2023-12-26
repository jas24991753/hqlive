import { _decorator, Component, Node } from 'cc';
import { Core } from '../../Core';
import { CoreEvent } from '../events/CoreEvent';
const { ccclass, property } = _decorator;

@ccclass('GameItem')
export class GameItem extends Component {

    id: string = '';

    open(): void {
        new Core().event.emit(CoreEvent.OPEN_GAME, this.id);
    }

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.open, this);
    }

    update(deltaTime: number) {

    }
}

