export class NativeEvent {
    /** 開啟native text input */
    public static readonly JSB_OPEN_TEXT_INPUT = 'JSB_OPEN_TEXT_INPUT';
    /** 通知App端進入自拍頁 */
    public static readonly JSB_OPEN_SELFIE_STREAMING = 'JSB_OPEN_SELFIE_STREAMING';
    /** 通知App端開啟直播 */
    public static readonly JSB_OPEN_LIVE_STREAMING = 'JSB_OPEN_LIVE_STREAMING';
    /** 通知App端關閉直播 */
    public static readonly JSB_CLOSE_LIVE = 'JSB_CLOSE_LIVE';
    /** 通知App端將直播畫面全屏顯示 */
    public static readonly JSB_SET_LIVE_FULL_SCREEN = 'JSB_SET_LIVE_FULL_SCREEN';
    /** 通知App端返回大廳 */
    public static readonly JSB_BACK_LOBBY = 'JSB_BACK_LOBBY';
    /** 通知App端設定自拍特效 */
    public static readonly JSB_SET_SELFIE_EFFECT = 'JSB_SET_SELFIE_EFFECT';
    /** 通知App端進行OAuth */
    public static readonly JSB_TRIGGER_OAUTH = 'JSB_TRIGGER_OAUTH';
    /** 通知App端驗證使用者是否已有效登入 */
    public static readonly JSB_CHECK_USER_AUTHENTICATION = 'JSB_CHECK_USER_AUTHENTICATION';
    /** 通知App端印出指定consolelog */
    public static readonly JSB_LOG = 'JSB_LOG';

    /** 通知cocos端請求將live全屏 */
    public static readonly JSB_APP_FOCUS_LIVE = 'JSB_APP_FOCUS_LIVE';
    /** 通知cocos端直播串流已開啟 */
    public static readonly JSB_APP_LIVE_STREAMING_OPENED = 'JSB_APP_LIVE_STREAMING_OPENED';
    /** 通知cocos端轉場通知 */
    public static readonly JSB_APP_NOTIFY_TRANSITION_SCENE = 'JSB_APP_NOTIFY_TRANSITION_SCENE';
    /** 通知cocos端AUTH SUCCESS */
    public static readonly JSB_APP_LOGIN_SUCCESS = 'JSB_APP_OAUTH_SUCCESS';
    /** 通知cocos端AUTH FAIL */
    public static readonly JSB_APP_LOGIN_FAILED = 'JSB_APP_LOGIN_FAILED';
    /** 通知cocos端使用者尚未登入 */
    public static readonly JSB_APP_USER_UNAUTHORIZED = 'JSB_APP_USER_UNAUTHORIZED';
    /** 通知cocos端使用者已登入過 */
    public static readonly JSB_APP_USER_AUTHORIZED = 'JSB_APP_USER_AUTHORIZED';
}