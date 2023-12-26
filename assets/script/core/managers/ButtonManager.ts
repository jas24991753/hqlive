import { _decorator, Button } from 'cc';
import { IStateItem } from '../stateMachine/IStateItem';
import { IStateListener } from '../stateMachine/IStateListener';
import { ButtonStateTable } from '../type/ButtonTypes';
const { ccclass } = _decorator;

export class ButtonManager implements IStateListener {
    private buttons: { [key: string]: Button } = {};

    public buttonStateTable: ButtonStateTable;

    public registerButton(button: Button): void {
        this.buttons[button.name] = button;
    }

    public destroy(): void {

    }

    onStateChanged(stateItem: IStateItem): void {
        // 1. 根據當前狀態取得對應的按鈕/state設定檔
        const stateTable = this.buttonStateTable[stateItem.name];
        if (!stateTable) {
            return;
        }

        // 設定每一個按鈕狀態
        for (const key in stateTable) {
            if (!this.buttons[key]) {
                console.warn(`Try set the button:${key}, but can't find button instance.`);
                return;
            }
            const button = this.buttons[key].getComponent(Button);
            const attr = stateTable[key];

            // 是否可視
            this.buttons[key].node.active = attr.visible;

            // 是否可點擊
            button.enabled = attr.enabled;

            // 是否為禁止點擊(按鈕會變暗)
            button.interactable = attr.interactive;
        }
    };
}

