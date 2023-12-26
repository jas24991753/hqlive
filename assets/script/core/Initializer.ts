import { _decorator, Component, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Initializer')
export class Initializer extends Component {
    onLoad() {
        window.eventEmitter = new EventTarget();
    }

    update(deltaTime: number) {

    }
}

