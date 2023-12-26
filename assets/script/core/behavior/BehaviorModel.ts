import { Component } from "cc";
import { BaseBehavior } from "./BaseBehavior";
import { IAction } from "./IAction";
import { IBehaviorModelConfig } from "./IBehaviorModelConfig";
import { IBehaviorObject } from "./IBehaviorObject";

/**
 * 策略模型, 可用來串接自定的動作順序
 *
 * @export
 * @class BehaviorModel
 */
export class BehaviorModel {

    private _startBehavior: BaseBehavior;

    private _stopBehavior: BaseBehavior;

    private _actionMap: { [key: string]: BaseBehavior } = {};

    public init(component: Component, config: IBehaviorModelConfig): void {
        this._startBehavior = config.start.behavior;
        this._startBehavior.init(component, config.start.config);

        this._stopBehavior = config.stop.behavior;
        this._stopBehavior.init(component, config.stop.config);

        if (config.customActions) {
            config.customActions.forEach((item: IBehaviorObject) => {
                this._actionMap[item.key] = item.behavior;
                this._actionMap[item.key].init(component, item.config);
            });
        }
    }

    public start(data?: any): Promise<any> {
        return this._startBehavior.run();
    }

    public stop(data?: any): Promise<any> {
        return this._stopBehavior.run();
    }

    public reset(key: string): void {
        this._actionMap[key].reset();
    }

    public runService(action: IAction): void {
        this._actionMap[action.key].run(action.data);
    }

    /**
     * 觸發指定行為的stop method
     *
     * @param {string} key
     * @memberof BehaviorModel
     */
    public stopService(key: string): void {
        this._actionMap[key].stop();
    }

    /**
     * 執行特定的行為流程
     *
     * @param {Array<IAction>} actions
     * @param {boolean} [sync=true] 是否為同步執行. 預設為true
     * @returns {Promise<any>}
     * @memberof BehaviorModel
     */
    public runCustomFlow(actions: Array<IAction>, sync = true): Promise<any> {
        if (sync) {
            const actionArray = actions.map((action: IAction) => {
                if (!this._actionMap[action.key]) {
                    console.error(`Undefined action:${action.key}`);
                    return;
                }

                return {
                    action: this._actionMap[action.key],
                    data: action.data,
                    config: action.config,
                    stop: action.stop,
                    runBefore: action.runBefore,
                    runAfter: action.runAfter
                }
            });

            return actionArray.reduce((prev, current) => {
                return prev.then(() => {
                    if (current.runAfter) {
                        return current.action.run(current.data).then(() => {
                            this._actionMap[current.runAfter].run();
                        });
                    }
                    if (current.stop) {
                        this._actionMap[current.stop].stop();
                    }
                    return current.action.run(current.data, current.config);
                })
            }, Promise.resolve());
        } else {
            return Promise.all(actions.map((action) => { return this._actionMap[action.key].run(action.data) }));
        }
    }
}