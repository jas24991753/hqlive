import { singleton } from "./decorators/singleton";

@singleton
export class Store {

    constructor() {
        this.reset();
    }

    private _focusTabIndex: number;
    /**
     * 主大廳頁籤資訊
     *
     * @memberof Store
     */
    public get focusTabIndex(): number {
        return this._focusTabIndex;
    }
    public set focusTabIndex(value: number) {
        this._focusTabIndex = value;
    }

    private _isFloat: boolean;
    /** 當前遊戲是否為漂浮狀態呈現(配合live app使用) */
    public get isFloat(): boolean {
        return this._isFloat;
    }
    public set isFloat(value: boolean) {
        this._isFloat = value;
    }

    private _focusTarget: 'game' | 'live';
    /**
     * 當前主要場景
     *
     * @type {('game' | 'live')}
     * @memberof Store
     */
    public get focusTarget(): 'game' | 'live' {
        return this._focusTarget;
    }
    public set focusTarget(value: 'game' | 'live') {
        this._focusTarget = value;
    }

    private _isLiveStreaming: boolean;

    /** 是否正在直播 */
    public get isLiveStreaming(): boolean {
        return this._isLiveStreaming;
    }
    public set isLiveStreaming(value: boolean) {
        this._isLiveStreaming = value;
    }

    /** 當前開啟的遊戲id */
    public gameId: string;

    public bind(key: string, store: any) {
        this[key] = store;
    }

    public getStore(key: string): any {
        if (this[key]) {
            return this[key];
        }
    }

    public reset(): void {
        this.isLiveStreaming = false;
        this.isFloat = false;
        this.focusTarget = 'game';
        this.focusTabIndex = 0;
        this.gameId = null;
    }
}