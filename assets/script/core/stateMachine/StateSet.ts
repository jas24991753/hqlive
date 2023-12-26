import { IStateItem } from "./IStateItem";

/**
 * 多個狀態的集合物件
 *
 * @export
 * @class StateSet
 */
export default class StateSet {
    private _states: { [key: string]: IStateItem } = {};

    private _order: Array<string> = [];

    public order(): Array<string> {
        return this._order;
    }

    constructor(stateNames: Array<string> = []) {
        this._order = stateNames.slice(0);

        stateNames.forEach((name) => {
            this._states[name] = {
                name,
                data: null
            }
        });
    }

    public removeStateByName(name: string): void {
        delete this._states[name];
        this._order.splice(this._order.indexOf(name), 1);
    }

    public getStateItemByName(name: string): IStateItem {
        return this._states[name];
    }

    public setStateData(name: string, data: any = null): void {
        this._states[name] = {
            name,
            data
        };
    }

    public toArray(): Array<IStateItem> {
        return this._order.map((name) => {
            return this._states[name];
        });
    }

    /**
     * 在指定state後插入狀態元件
     *
     * @param {string} name
     * @param {IStateItem} stateItem
     * @memberof StateSet
     */
    public insertAfter(name: string, stateItem: IStateItem): void {
        this._order.splice(this._order.indexOf(name) + 1, 0, stateItem.name);
        this._states[stateItem.name] = stateItem;
    }

    /**
     * 加入一個狀態元件
     *
     * @param {IStateItem} stateItem
     * @memberof StateSet
     */
    public insert(stateItem: IStateItem): void {
        this._order.push(stateItem.name);
        this._states[stateItem.name] = stateItem;
    }

    /**
     * 結合兩個狀態集合, 如果傳入的狀態物件已存在則會覆寫原有資料
     * 
     * @param {StateSet} target 
     * @returns {StateSet} 
     * @memberof StateSet
     */
    public merge(target: StateSet): StateSet {
        const stateItems: Array<IStateItem> = target.toArray();

        stateItems.forEach((item: IStateItem) => {
            if (this._states[item.name] === undefined) {
                this._order.push(item.name);
            }
            this.setStateData(item.name, item.data);
            this._states[item.name] = item;
        });

        return this;
    }
}