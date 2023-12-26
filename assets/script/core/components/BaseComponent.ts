import { _decorator, Component, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseComponent')
export class BaseComponent extends Component {

    public get event(): EventTarget {
        if (!window.eventEmitter) {
            window.eventEmitter = new EventTarget();
        }

        return window.eventEmitter;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


