import { singleton } from "../core/decorators/singleton";
import { SlotState } from "./SlotState";

@singleton
export class SlotStore {
    constructor() {
        this.reset();
    }

    private _bet: number;
    public get bet(): number {
        return this._bet;
    }
    public set bet(value: number) {
        this._bet = value;
    }

    private _state: SlotState;
    public get state(): SlotState {
        return this._state;
    }
    public set state(value: SlotState) {
        this._state = value;
    }

    private _respinReelCount: number;
    /** 需要respin的輪軸數量 */
    public get respinReelCount(): number {
        return this._respinReelCount;
    }
    public set respinReelCount(value: number) {
        this._respinReelCount = value;
    }

    private _currentStopReelCount: number;
    /** 目前停輪輪軸數量 */
    public get currentStopReelCount(): number {
        return this._currentStopReelCount;
    }
    public set currentStopReelCount(value: number) {
        this._currentStopReelCount = value;
    }

    public reset(): void {
        this._bet = 0;
        this._respinReelCount = 0;
        this._currentStopReelCount = 0;
    }
}