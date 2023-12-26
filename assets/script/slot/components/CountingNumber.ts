import { _decorator, CCFloat, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 跑分表演
 */
@ccclass('CountingNumber')
export class CountingNumber extends Component {
    private _isPlaying: boolean = false;

    private _currentVal: number = 0;

    private _targetVal: number;

    private _currentIndex: number = 0;

    private _interval: number;

    private _onCompleteResolve: Function;

    private _label: Label;

    private _level: Array<number> = [];

    private _levelHandler: Array<Function> = [];

    private _bet: number;

    @property({ type: CCFloat, tooltip: "表演時長,單位:秒" })
    protected duration = 3;

    start() {
        this._label = this.node.getComponent(Label);
    }

    /** 設定玩家下注額 */
    public bet(value: number): void {
        this._bet = value;
    }

    /**
     * 滿足跑分達到不同倍率所要觸發的行為
     *
     * @param {number} multiplier 滿足倍率
     * @param {CountingTextHook} callback
     * @memberof CountingText
     */
    public hook(multiplier: number, callback: () => void): void {
        this._level.push(multiplier);
        this._levelHandler.push(callback);
    }

    /**
     * 開始滾分
     *
     * @param {number} val 目標數字
     * @param {boolean} [resetCurrentVal=true] 是否要重置現在數值. 預設true
     * @returns {Promise<any>}
     * @memberof CountingText
     */
    public run(val: number, resetCurrentVal: boolean = true): Promise<any> {
        this.node.active = true;
        this.reset(resetCurrentVal);
        this._targetVal = resetCurrentVal ? val : val + this._currentVal;
        this._isPlaying = true;
        this.setInterval(this._targetVal);
        return new Promise((resolve) => {
            this._onCompleteResolve = resolve;
        });
    }

    public hide(): void {
        this.node.active = false;
        this.reset();
    }

    /**
     * 在滾分過程中動態加值
     *
     * @memberof CountingText
     */
    public addVal(val: number): void {
        if (!this._isPlaying || !val || val < -1) {
            return;
        }
        this._targetVal += val;
        this.setInterval(this._targetVal);
    }

    public reset(resetCurrentVal: boolean = true): void {
        if (this._isPlaying) {
            this.stop();
        }
        if (resetCurrentVal) {
            this._currentVal = 0;
            this._currentIndex = -1;
        }
        this._targetVal = 0;
        this._label.string = this._currentVal.toString();
    }

    public stop(): void {
        this._isPlaying = false;
    }

    update(deltaTime: number) {
        if (!this._isPlaying) {
            return;
        }

        // 如果有hook決定是否觸發
        if (this._level.length > 0) {
            let index = (this._currentIndex !== -1) ? this._currentIndex + 1 : 0;
            let trigger = false;
            while (this._currentVal / this._bet > this._level[index]) {
                index++;
                trigger = true;
            }
            if (trigger && this._levelHandler[index - 1]) {
                const callback = this._levelHandler[index - 1];
                callback();
                this._currentIndex = index - 1;
            }
        }

        let canStop = false;
        this._currentVal += this._interval;
        if (this._currentVal >= this._targetVal) {
            this._currentVal = this._targetVal;
            canStop = true;
        }

        this._label.string = this._currentVal.toFixed(2);

        if (canStop) {
            this.stop();
            this._onCompleteResolve();
        }
    }

    private setInterval(val: number): void {
        this._interval = (val - this._currentVal) / (this.duration * 60);
        if (!this._interval) {
            this._interval = val;
        }
    }
}

