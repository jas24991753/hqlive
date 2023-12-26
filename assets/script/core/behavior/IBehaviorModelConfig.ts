import { IBehaviorObject } from "./IBehaviorObject";

export interface IBehaviorModelConfig {
    start: IBehaviorObject;
    stop: IBehaviorObject;
    feature?: IBehaviorObject;
    customActions?: Array<IBehaviorObject>;
}