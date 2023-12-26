export class CoreEvent {
    /** 轉場到live場景 */
    public static readonly TRANSITION_TO_LIVE = 'TRANSITION_TO_LIVE';
    /** 轉場到game場景 */
    public static readonly TRANSITION_TO_GAME = 'TRANSITION_TO_GAME';
    /** 開啟live menu */
    public static readonly OPEN_LIVE_MENU = 'OPEN_LIVE_MENU';
    /** 開啟game menu */
    public static readonly OPEN_GAME_MENU = 'OPEN_GAME_MENU';
    /** 開啟遊戲 */
    public static readonly OPEN_GAME = 'OPEN_GAME';
    /** 使用者在live/game中切換主要視窗 */
    public static readonly SWAP = 'SWAP';
    /** 使用者focus live */
    public static readonly FOCUS_LIVE = 'FOCUS_LIVE';
    /** 使用者focus game */
    public static readonly FOCUS_GAME = 'FOCUS_GAME';
    /** 使用者將遊戲設為漂浮模式 */
    public static readonly SET_FLOAT_GAME_DISPLAY = 'SET_FLOAT_GAME_DISPLAY';
    /** 使用者將遊戲設為非漂浮模式 */
    public static readonly SET_NON_FLOAT_GAME_DISPLAY = 'SET_NON_FLOAT_GAME_DISPLAY';
    /** 收到APP回應直播串流已開啟 */
    public static readonly APP_LIVE_STREAMING_OPENED = 'APP_LIVE_STREAMING_OPENED';
}