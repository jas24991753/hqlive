import { Sprite, _decorator } from 'cc';
import { BaseComponent } from '../core/components/BaseComponent';
import { NativeEvent } from '../core/events/NativeEvent';
const { ccclass, property } = _decorator;

@ccclass('Authentication')
export class Authentication extends BaseComponent {

    @property({ type: Sprite })
    forground: Sprite = null;


    start() {
        this.forground.enabled = false;

        this.event.on(NativeEvent.JSB_TRIGGER_OAUTH, this.authenting, this);

    }

    authenting() {
        this.forground.enabled = true;
    }
}