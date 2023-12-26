import { Component } from "cc";
import { delay } from "../../utils/cocos/delay";
import { IBehaviorConfig } from "./IBehaviorConfig";

/**
 * 
 *
 * @export
 * @class BaseBehavior
 */
export class BaseBehavior {

    protected component: Component;

    protected config: IBehaviorConfig;

    protected get beforeDelayVal(): number {
        if (this.config && this.config.beforeDelay !== undefined) {
            return this.config.beforeDelay;
        } else {
            return 0;
        }
    }

    protected get afterDelayVal(): number {
        if (this.config && this.config.afterDelay !== undefined) {
            return this.config.afterDelay;
        } else {
            return 0;
        }
    }

    protected bindcomponent(component: Component): void {
        this.component = component;
    }

    protected beforeDelay(): Promise<any> {
        return delay(this.beforeDelayVal);
    }

    protected afterDelay(): Promise<any> {
        return delay(this.afterDelayVal);
    }

    protected runAction(data: any, config?: any): Promise<any> {
        return Promise.resolve();
    }

    public init(component: Component, config: IBehaviorConfig = {}): void {
        this.bindcomponent(component);
        this.config = config || {};
        this.config.beforeDelay = this.config.beforeDelay || 0;
        this.config.afterDelay = this.config.afterDelay || 0;
    }

    public reset(): void {

    }

    public run(data?: any, config?: any): Promise<any> {
        return this.beforeDelay()
            .then(() => {
                return this.runAction(data, config);
            }).then(() => {
                return this.afterDelay();
            });
    }

    public stop(): void {
    }

}