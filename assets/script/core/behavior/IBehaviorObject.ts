import { BaseBehavior } from "./BaseBehavior";

export interface IBehaviorObject {
    behavior: BaseBehavior;
    key?: string;
    config?: any;
}