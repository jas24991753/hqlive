import { IStateItem } from "./IStateItem";

export interface IStateListener {
    onStateChanged: (stateItem: IStateItem) => void;
}

export interface IStateComponent extends IStateListener {
    onStateFunctionDone: (stateItem: IStateItem) => void;
}
