import { _decorator, Component, Node } from 'cc';
import { Core } from '../Core';
import { CoreEvent } from '../core/events/CoreEvent';
const { ccclass, property } = _decorator;

@ccclass('StreamerItem')
export class StreamerItem extends Component {

    id: string = '';

    open(): void {
        new Core().event.emit(CoreEvent.OPEN_LIVE_STREAMING, this.id);
    }

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.open, this);
    }

    update(deltaTime: number) {

    }
}

