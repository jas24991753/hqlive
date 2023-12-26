import { IActionData } from "./IActionData";

/**
 * 
 *
 * @export
 * @interface IAction
 */
export interface IAction {
    key: string;

    /**
     * pass config to override default config
     * 
     * @type {*}
     * @memberof IAction
     */
    config?: any;

    /**
     * perfoming data
     * 
     * @type {*}
     * @memberof IAction
     */
    data?: IActionData;

    /**
     *  run specific action BEFORE main action by key
     * 
     * @type {string}
     * @memberof IAction
     */
    runBefore?: string;

    /**
     *  run specific action AFTER main action by key
     * 
     * @type {string}
     * @memberof IAction
     */
    runAfter?: string;

    /**
     * stop specific action by key
     * 
     * @type {string}
     * @memberof IAction
     */
    stop?: string;
}