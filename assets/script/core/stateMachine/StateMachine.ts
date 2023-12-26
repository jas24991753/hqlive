import { EventTarget } from "cc";
import { Core } from "../../Core";
import { IStateItem } from "./IStateItem";
import { StateMachineEvent } from "./StateMachineEvent";
import { StateMachineStatus } from "./StateMachineStatus";

export default class StateMachine {
    protected event: EventTarget;

    protected _states: Array<IStateItem> = [];

    protected child: StateMachine;
    protected parent: StateMachine;

    /**
     * pause為true,會不讓statemachine更新狀態
     *
     * @private
     * @type {boolean}
     * @memberof LotteryStateMachine
     */
    private _pause: boolean = false;

    public get pause(): boolean {
        return this._pause;
    }

    public set pause(val: boolean) {
        if (val) {
            this._status = StateMachineStatus.PAUSED;
        }
        this._pause = val;
        if (!val && this._readyForNextState) {
            this.onStateCompleted();
            this._readyForNextState = false;
        }
    }

    /** 狀態機從暫停中恢復, 是否可以繼續執行 */
    private _readyForNextState = false;

    public get states(): Array<IStateItem> {
        return this._states;
    }

    protected _currentStateName: string = null;
    protected _prevStateName: string = null;

    public get prevStateName(): string {
        return this._prevStateName;
    }

    public get currentStateName(): string {
        return this._currentStateName;
    }

    private _status: StateMachineStatus = StateMachineStatus.IDLE;

    public status(): StateMachineStatus {
        return this._status;
    }

    constructor() {
        this.event = new Core().event;

        this.init();
        this.addListener();

    }

    protected init(): void {

    }

    protected addListener(): void {
        this.event.on(StateMachineEvent.ON_STATE_COMPLETED, this.onStateCompleted, this);
    }

    protected onChildStateChanged(stateItem: IStateItem): void {
        if (!this.child) {
            return;
        }

        if (this.pause) {
            return;
        }

        this.setState(stateItem);
    }

    protected setState(stateItem: IStateItem): void {
        console.log('[state-machine]', stateItem.name);
        this._prevStateName = this._currentStateName;
        this._currentStateName = stateItem.name;
        this.event.emit(StateMachineEvent.ON_STATE_CHANGED, stateItem);
    }

    /**
     * 傳入狀態集合至狀態機中開始執行
     *
     * @param {Array<IStateItem>} states
     * @param {boolean} [cleanCurrentFlow=false]
     * @return {*}  {void}
     * @memberof StateMachine
     */
    public push(states: Array<IStateItem>, cleanCurrentFlow: boolean = false): void {
        if (this.pause) {
            return;
        }

        this._status = StateMachineStatus.RUNNING;

        if (!cleanCurrentFlow) {
            this._states = this._states.concat(states);
        } else {
            this._states = states;
        }

        this.pop();
    }

    /**
     * 動態設定pending中的state data
     *
     * @param {string} stateName
     * @param {*} [data=null]
     * @memberof StateMachine
     */
    public setStateData(stateName: string, data: any = null): void {
        this._states.forEach((state) => {
            if (state.name === stateName) {
                state.data = data;
            }
        });
    }

    public skipState(): void {
        if (this._states.length > 0) {
            this.pop();
        }
    }

    public removePendingStates(name: string): void {
        this._states = this.states.filter((item) => {
            return item.name !== name;
        });
    }

    /**
     * 重置state machine, 如果目前在某狀態,會先skip該狀態,然後清空所有pending states
     *
     * @memberof StateMachine
     */
    public reset(): void {
        this._states = [];
        //先skip當前state
        if (this.currentStateName !== null) {
            const stateItem: IStateItem = {
                name: `skip_${this._currentStateName}`,
                data: null
            };

            // console.log('[state-machine]', stateItem.name);

            this.event.emit(StateMachineEvent.ON_STATE_CHANGED, stateItem);
        }
        this._currentStateName = null;
        this._readyForNextState = false;
    }

    public destroy(): void {
        this.event.off(StateMachineEvent.ON_STATE_COMPLETED, this.onStateCompleted, this);
    }

    protected onStateCompleted(): void {
        if (this.pause) {
            this._readyForNextState = true;
            return;
        }

        this.pop();
    }

    protected pop(): void {
        const nextState: IStateItem = this._states.shift();

        if (nextState) {
            this.setState(nextState);
        } else {
            this._status = StateMachineStatus.IDLE;
        }
    }
}