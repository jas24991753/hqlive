import { EventTarget } from "cc";
import { History } from "./core/History";
import { singleton } from './core/decorators/singleton';
@singleton
export class Core {
    public history: History;

    public event: EventTarget;

    constructor() {
        if (!window.eventEmitter) {
            window.eventEmitter = new EventTarget();
        }

        this.event = window.eventEmitter;
    }
}

