import { _decorator } from 'cc';
import { ButtonStateTable } from '../core/type/ButtonTypes';
import { SlotState } from './SlotState';
const { ccclass, property } = _decorator;

export class SlotButtonState {
    public static default: ButtonStateTable = {
        [SlotState.IDLE]: {
            'Spin<Button>': { visible: true, enabled: true, interactive: true },
            'Stop<Button>': { visible: false, enabled: false, interactive: false }
        },
        [SlotState.SPINNING]: {
            'Spin<Button>': { visible: false, enabled: false, interactive: false },
            'Stop<Button>': { visible: true, enabled: true, interactive: true }
        },
        [SlotState.STOPPING_SPIN]: {
            'Spin<Button>': { visible: false, enabled: false, interactive: false },
            'Stop<Button>': { visible: true, enabled: false, interactive: false }
        },
        [SlotState.WINLINE_LOOP]: {
            'Spin<Button>': { visible: true, enabled: true, interactive: true },
            'Stop<Button>': { visible: false, enabled: false, interactive: false }
        }
    }
}

