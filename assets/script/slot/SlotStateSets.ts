import { StateSets } from "../core/StateSets";
import { SlotState } from "./SlotState";

export class SlotStateSets extends StateSets {
    public static IDLE: Array<string> = [
        SlotState.INITIALIZE,
        SlotState.IDLE
    ];

    /** 下注 */
    public static START_PLAY: Array<string> = [
        SlotState.START_SPIN,
        SlotState.SPINNING
    ];

    /** 收到表演結果 */
    public static ON_RESULT: Array<string> = [
        SlotState.STOPPING_SPIN,
        SlotState.ALL_REEL_STOPPED,
        // SlotState.TRIGGER_STEPPER,
        // SlotState.TRIGGER_RESPIN,
        SlotState.SHOWING_ALL_WINLINE,
        SlotState.SHOWING_BIG_WIN,
        SlotState.WINLINE_LOOP,
    ];

}

