import { _decorator } from 'cc';
import { IStateItem } from '../core/stateMachine/IStateItem';
import { StateComponent } from '../core/stateMachine/StateComponent';
const { ccclass, property } = _decorator;

@ccclass('BaseReelSet')
export class BaseReelSet extends StateComponent {
    start() {
    }

    update(deltaTime: number) {

    }

    IDLE(data: unknown): Promise<void> {
        return Promise.resolve();
    }

    START_SPIN(data: unknown): Promise<void> {
        return Promise.resolve();
    }

    STOPPING_SPIN(data: unknown): Promise<void> {
        return Promise.resolve();
    }

    onStateChanged(stateItem: IStateItem): void {
        // console.log('onStateChanged', stateItem);
    }
}

