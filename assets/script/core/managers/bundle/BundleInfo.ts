import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

/** 路徑 */
export type Path = string;

/**
 * bundle資源描述
 *
 * @export
 * @interface BundleAsset
 */
export interface BundleAsset {
    md5: string;
    size: number;
    ext: string;
}

export class BundleInfo {
    public name;
    public version;
    public assets: { [key: Path]: BundleAsset }
}

export enum BundleState {
    START,
    PROGRESS,
    DONE
}

