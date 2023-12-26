import { _decorator, Button, Component, Node } from 'cc';
import { Core } from '../Core';
import { CoreEvent } from '../core/events/CoreEvent';
const { ccclass, property } = _decorator;

@ccclass('GameIntroItem')
export class GameIntroItem extends Component {

    id: string = '';

    @property({ type: Button })
    playButton: Button;

    open(): void {
        console.log('開啟遊戲', this.id);
        new Core().event.emit(CoreEvent.OPEN_GAME, { id: this.id });
    }

    start() {
        this.playButton.node.on(Node.EventType.TOUCH_END, this.open, this);
    }

    update(deltaTime: number) {

    }
}

