export interface IBehaviorConfig {
    /**
     * 行為前的delay, 單位:秒
     * 
     * @type {number}
     * @memberof IBehaviorConfig
     */
    beforeDelay?: number;

    /**
     * 行為完成後的delay, 單位:秒
     * 
     * @type {number}
     * @memberof IBehaviorConfig
     */
    afterDelay?: number;
}