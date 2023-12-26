export class SlotEvent {
    /** 觸發輪軸旋轉 */
    public static readonly TRIGGER_SPIN = 'TRIGGER_SPIN';
    /** 觸發停輪 */
    public static readonly TRIGGER_STOP_SPIN = 'TRIGGER_STOP_SPIN';
    /** 玩家點擊特定feature */
    public static readonly TRIGGER_PICK_FEATURE = 'TRIGGER_PICK_FEATURE';
    /** 觸發自動遊戲 */
    public static readonly TRIGGER_AUTO_SPIN = 'TRIGGER_AUTO_SPIN';
    /** 玩家選擇了特定自動遊戲的次數 */
    public static readonly SET_AUTO_SPIN_TIMES = 'SET_AUTO_SPIN_TIMES';
    /** 某一輪停輪事件 */
    public static readonly ON_REEL_STOPPED = 'ON_REEL_STOPPED';
}