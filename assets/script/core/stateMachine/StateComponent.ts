import { _decorator, Component } from 'cc';
import { IStateItem } from './IStateItem';
import { IStateComponent } from './IStateListener';
const { ccclass, property } = _decorator;

@ccclass('StateComponent')
export class StateComponent extends Component implements IStateComponent {

    onStateFunctionDone(stateItem: IStateItem): void {
        console.log('done');
    }

    onStateChanged(stateItem: IStateItem): void {

    }
}

