import { AssetManager, _decorator, assetManager, native } from 'cc';
import { singleton } from '../../decorators/singleton';
import { Defer } from '../../utils/Defer';
import { BundleLoader } from './BundleLoader';
const { ccclass, property } = _decorator;


const manifestTemplate = JSON.stringify({
    "packageUrl": "http://192.168.55.13:5502/remote-assets/",
    "remoteManifestUrl": "http://192.168.55.13:5502/remote-assets/project.manifest",
    "remoteVersionUrl": "http://192.168.55.13:5502/remote-assets/version.manifest",
    "version": "0.0.0",
    "assets": {
    },
    "searchPaths": []
});

const remoteManifest = JSON.stringify({
    "packageUrl": "http://192.168.55.13:5502/remote-assets/",
    "remoteManifestUrl": "http://192.168.55.13:5502/remote-assets/project.manifest",
    "remoteVersionUrl": "http://192.168.55.13:5502/remote-assets/version.manifest",
    "version": "1.0.0",
    "assets": {
    },
    "searchPaths": []
});

/**
 * bundle狀態相關管理
 * 供原生APP使用
 *
 * @export
 * @class BundleManager
 */
@singleton
export class BundleManager {
    private bundleLoaders: Map<string, BundleLoader> = new Map();

    private bundleDefers: Map<string, Defer<void>> = new Map();

    private assetsManager: native.AssetsManager;

    /** 機器本地儲存位置 */
    private localDevicePath: string;

    public onBundleFailed: Function;

    public onBundleProgress: Function;

    public onBundleLoaded: Function;

    public bundleServerUrl: string;

    public bundle: { [key: string]: AssetManager.Bundle } = {};

    public init(bundleNames: string[]): void {
        this.prepareBundles(bundleNames);

        // 默认的搜索路径
        const searchPaths = native.fileUtils.getSearchPaths();

        // hotUpdateSearchPaths 会前置在 searchPaths 数组的开头
        searchPaths.unshift(`${native.fileUtils.getWritablePath()}bundles/`);

        native.fileUtils.setSearchPaths(searchPaths);

        console.log('設定快取路徑', searchPaths);
    }

    public load(bundleName: string): Promise<void> {

        const defer = new Defer<void>();

        this.bundleDefers.set(bundleName, defer);

        const loader = this.bundleLoaders.get(bundleName);
        loader.update();

        return defer.promise;
    }

    public loadBundle(bundleName: string): Promise<AssetManager.Bundle> {
        const loader = this.bundleLoaders.get(bundleName);
        return new Promise((resolve) => {
            if (!loader.canUpgrade() || loader.state == 50 + native.EventAssetsManager.UPDATE_FINISHED) {
                assetManager.loadBundle(`${loader.localBundleRoot}`, (err, bundle) => {
                    if (bundle) {
                        resolve(bundle);
                    } else {
                        console.log('something wrong');
                    }
                });
            }
        });
    }

    public getBundleLoader(bundleName: string): BundleLoader {
        return this.bundleLoaders.get(bundleName);
    }

    /**
     * 建立bundle loaders
     *
     * @param {string[]} bundleNames
     * @memberof BundleManager
     */
    private prepareBundles(bundleNames: string[]): void {
        bundleNames.forEach((name) => {
            const bundleLoader = new BundleLoader(name, this.bundleServerUrl);

            bundleLoader.onStateUpdate = this.onBundleStateUpdate.bind(this);

            bundleLoader.init();
            this.bundleLoaders.set(name, bundleLoader);
        });
    };

    private onBundleStateUpdate(name: string, state: native.AssetsManager.State): void {
        switch (state) {
            case 50 + native.EventAssetsManager.UPDATE_FINISHED:
                this.bundleDefers.get(name).resolve();
                break;
        }

    }
}

