import { _decorator, Button, Component } from 'cc';
import { Core } from '../Core';
import { ButtonManager } from '../core/managers/ButtonManager';
import { ComponentManager } from '../core/managers/ComponentManager';
import { IStateItem } from '../core/stateMachine/IStateItem';
import { IStateListener } from '../core/stateMachine/IStateListener';
import StateMachine from '../core/stateMachine/StateMachine';
import { StateMachineEvent } from '../core/stateMachine/StateMachineEvent';
import StateSet from '../core/stateMachine/StateSet';
import { ReelSet } from './ReelSet';
import { SlotButtonState } from './SlotButtonState';
import { SlotEvent } from './SlotEvent';
import { SlotStateSets } from './SlotStateSets';
import { SlotStore } from './SlotStore';
const { ccclass, property } = _decorator;

@ccclass('BaseSlotGame')
export abstract class BaseSlotGame extends Component implements IStateListener {
    protected abstract initComponentManager(): void;

    protected stateMachine: StateMachine;

    protected componentManager: ComponentManager;
    protected buttonManager: ButtonManager;

    protected store: SlotStore;

    @property(ReelSet)
    reelSet: ReelSet;

    @property(Button)
    spinButton: Button;

    @property(Button)
    stopSpinButton: Button;

    @property(Button)
    swapButton: Button;

    @property(Button)
    minimizeButton: Button;

    protected initEvent(): void {
        const core = new Core();
        core.event.on(StateMachineEvent.ON_STATE_CHANGED, this.onStateChanged, this);
        core.event.on(SlotEvent.TRIGGER_SPIN, this.triggerSpin, this);
        core.event.on(SlotEvent.TRIGGER_STOP_SPIN, this.triggerStopSpin, this);
        // core.event.on(CoreEvent.OPEN_LIVE_STREAMING, this.openLiveStreaming, this);
    }

    protected init(): void {

    }

    start() {
        this.stateMachine = new StateMachine();
        this.componentManager = new ComponentManager();
        this.buttonManager = new ButtonManager();

        this.buttonManager.buttonStateTable = SlotButtonState.default;

        this.buttonManager.registerButton(this.spinButton);
        this.buttonManager.registerButton(this.stopSpinButton);

        const slotStore = new SlotStore();
        window.application.store.bind('slot', slotStore);
        this.store = slotStore;

        this.initComponentManager();
        this.initEvent();
        this.init();
    }

    onDestroy(): boolean {

        this.componentManager.destroy();
        this.buttonManager.destroy();
        this.stateMachine.destroy();

        const core = new Core();
        core.event.off(StateMachineEvent.ON_STATE_CHANGED, this.onStateChanged, this);
        core.event.off(SlotEvent.TRIGGER_SPIN, this.triggerSpin, this);
        core.event.off(SlotEvent.TRIGGER_STOP_SPIN, this.triggerStopSpin, this);
        // core.event.off(CoreEvent.OPEN_LIVE_STREAMING, this.openLiveStreaming, this);
        return false;
    }

    openLiveStreaming(id: string): void {

    }

    triggerSpin(): void {
        const stateSet: StateSet = new StateSet(SlotStateSets.START_PLAY);
        this.stateMachine.push(stateSet.toArray());
    }

    triggerStopSpin(): void {
        const stateSet: StateSet = new StateSet(SlotStateSets.ON_RESULT);
        this.stateMachine.push(stateSet.toArray(), true);
    }

    update(deltaTime: number) {

    }

    onStateChanged(stateItem: IStateItem): void {
        new SlotStore().state = stateItem.name;

        this.componentManager.onStateChanged(stateItem);
        this.buttonManager.onStateChanged(stateItem);
        if (this[stateItem.name]) {
            this[stateItem.name](stateItem.data);
        }
    };
}

