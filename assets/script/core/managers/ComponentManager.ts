import { Core } from '../../Core';
import { IStateItem } from '../stateMachine/IStateItem';
import { IStateListener } from '../stateMachine/IStateListener';
import { StateComponent } from '../stateMachine/StateComponent';
import { StateMachineEvent } from '../stateMachine/StateMachineEvent';

export class ComponentManager implements IStateListener {
    /**
     * 
     * @protected
     * @type {Map<string, Array<StateComponent>>}
     * @memberof ModuleManager
     */
    private _componentMap: Map<string, StateComponent> = new Map<string, StateComponent>();

    private _componentCount: number = 0;


    public setComponentOrder(compoments: StateComponent[]): void {
        compoments.forEach((component) => {
            this._componentMap.set(component.name, component);
        });
    }

    public destroy(): void {
        
    }

    private isAllModuleCompleted(): boolean {
        return this._componentCount === this._componentMap.size;
    }

    private tryStateComplete(): void {
        if (this.isAllModuleCompleted()) {
            new Core().event.emit(StateMachineEvent.ON_STATE_COMPLETED);
        }
    }

    public onStateChanged(stateItem: IStateItem): void {
        this._componentCount = 0;

        this._componentMap.forEach((component) => {
            component.onStateChanged(stateItem);
            if (component[stateItem.name]) {
                component[stateItem.name](stateItem.data).then(() => {
                    this._componentCount += 1;
                    this.tryStateComplete();
                });
            } else { //該module未實作
                this._componentCount += 1;
                this.tryStateComplete();
            }
        });
    }

    // 組件觸發
    private stateCompleted(key: string): void {
        let comp = this._componentMap.get(key);
        if (comp) {
            this._componentCount += 1;
        }

        this.tryStateComplete();
    }
}

