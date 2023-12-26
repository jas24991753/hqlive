import { _decorator, ScrollView } from 'cc';
import { BaseComponent } from '../core/components/BaseComponent';
import { LiveEvent } from '../live/LiveEvent';
const { ccclass, property } = _decorator;

@ccclass('SelfieStreaming')
export class SelfieStreaming extends BaseComponent {

    @property({ type: ScrollView })
    effectMenu: ScrollView = null;

    toggleEffectMenu() {
        this.effectMenu.node.active = !this.effectMenu.node.active;
    }

    start() {
        this.event.on(LiveEvent.OPEN_EFFECT_MENU, this.toggleEffectMenu, this);
    }

    update(deltaTime: number) {

    }
}


