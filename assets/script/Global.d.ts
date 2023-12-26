import { EventTarget } from 'cc';
import { Application } from "./core/Application";

export { };

declare global {
    interface Window {
        application: Application;
        eventEmitter: EventTarget;
        setPositionY: Function;
        setPositionX: Function;
    }
}