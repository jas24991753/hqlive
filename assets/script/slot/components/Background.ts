import { _decorator, Component } from 'cc';
import { StateComponent } from '../../core/stateMachine/StateComponent';
const { ccclass, property } = _decorator;

/**
 * 根據不同情境的背景樣式處理
 *
 * @export
 * @class Background
 * @extends {Component}
 */
@ccclass('Background')
export class Background extends StateComponent {

    IDLE(): Promise<void> {
        return Promise.resolve();
    }

    START_SPIN(data: any): Promise<void> {
        return Promise.resolve();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

