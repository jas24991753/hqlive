export class StateMachineEvent {
    /** 全部狀態均完成後觸發 */
    public static readonly ON_STATE_COMPLETED = 'ON_STATE_COMPLETED';
    /** 每一個狀態完成後觸發 */
    public static readonly ON_STATE_CHANGED = 'ON_STATE_CHANGED';
}