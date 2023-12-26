export class SlotState {
    public static readonly INITIALIZE = 'INITIALIZE';
    /** 遊戲閒置中 */
    public static readonly IDLE = 'IDLE';
    public static readonly START_SPIN = 'START_SPIN';
    public static readonly SPINNING = 'SPINNING';
    public static readonly STOPPING_SPIN = 'STOPPING_SPIN';
    public static readonly ALL_REEL_STOPPED = 'ALL_REEL_STOPPED';
    public static readonly SHOWING_ALL_WINLINE = 'SHOWING_ALL_WINLINE';
    public static readonly SHOWING_BIG_WIN = 'SHOWING_BIG_WIN';
    public static readonly WINLINE_LOOP = 'WINLINE_LOOP';
    public static readonly PICK_FEATURE = 'PICK_FEATURE';

    //#region FEATURES
    /** 步進效果 */
    public static readonly TRIGGER_STEPPER = 'TRIGGER_STEPPER';
    public static readonly TRIGGER_RESPIN = 'TRIGGER_RESPIN';

    //#endregion FEATURES
}