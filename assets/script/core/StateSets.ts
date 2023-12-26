import { CoreState } from "./CoreState";

/**
 * 基本狀態集合類型
 *
 * @export
 * @class StateSets
 */
export class StateSets {

    public static ERROR: Array<string> = [
        CoreState.ERROR
    ];

    public static START_APPLICATION: Array<string> = [
        CoreState.PRELOADING,
        CoreState.CONNECTING_SERVER,
        CoreState.APPLICATION_READY
    ]
}