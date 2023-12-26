import { native } from "cc";

const manifestTemplate = JSON.stringify({
    "packageUrl": "",
    "remoteManifestUrl": "",
    "remoteVersionUrl": "",
    "version": "0.0.0",
    "assets": {
    },
    "searchPaths": []
});

export class BundleLoader {
    public name: string;
    private remoteBundleRoot: string;
    private _localBundleRoot: string;

    public get localBundleRoot(): string {
        return this._localBundleRoot;
    }
    private assetsManager: native.AssetsManager;

    private needUpgrade: boolean = false;

    private _state: native.AssetsManager.State = native.AssetsManager.State.UNINITED;

    private set state(value: native.AssetsManager.State) {

        if (this._state !== value && this.onStateUpdate) {
            this.onStateUpdate(this.name, value);
        }

        this._state = value;
    }

    public get state(): native.AssetsManager.State {
        return this._state;
    }

    public onStateUpdate: (name: string, state: native.AssetsManager.State) => void;

    /**
     * Creates an instance of BundleLoader.
     * @param {string} bundleName bundle 名稱
     * @param {string} remoteBundleRoot 遠端存放bundle資料夾的根路徑
     * @memberof BundleLoader
     */
    constructor(bundleName: string, remoteBundleRoot: string) {
        this.name = bundleName;
        this.remoteBundleRoot = remoteBundleRoot;
        this._localBundleRoot = `${native.fileUtils.getWritablePath()}bundles/${bundleName}`;
        console.log(`[${this.name}] local root`, this._localBundleRoot);
        this.assetsManager = new native.AssetsManager('', this._localBundleRoot);
        this.assetsManager.setEventCallback(this.onAssetsManagerUpdate.bind(this));
    }

    public init(): void {
        // 載入本地manifest
        let localManifestStr = native.fileUtils.getStringFromFile(`${this._localBundleRoot}/project.manifest`);
        if (!localManifestStr) {
            console.log(`[${this.name}]`, '未找到本地檔案');
            localManifestStr = manifestTemplate;
        }
        this.state = this.assetsManager.getState();
        const manifest = new native.Manifest(localManifestStr, this._localBundleRoot);
        this.assetsManager.loadLocalManifest(manifest, this._localBundleRoot);
        this.state = this.assetsManager.getState();
        console.log(`[${this.name}]取得本地版本`, manifest.getVersion());
        // 載入遠端bundle版本
        this.fetchVersion(this.name).then((version) => {
            console.log(`[${this.name}]取得遠端版本`, version);

            const updateStatus = this.compare(manifest.getVersion(), version);

            if (!updateStatus) {
                console.log(`[${this.name}]`, '遠端版本無更新');
                return;
            }

            console.log(`[${this.name}]`, '遠端版本較新');

            this.needUpgrade = true;

            this.state = this.assetsManager.getState();
            this.fetchManifest(this.name).then((str: string) => {
                const remoteManifest = new native.Manifest(str, this._localBundleRoot);
                this.assetsManager.loadRemoteManifest(remoteManifest);
                this.state = this.assetsManager.getState();
            });
        });
    }

    public canUpgrade(): boolean {
        return this.needUpgrade;
    }

    public update(): void {
        this.assetsManager.update();
        this.state = this.assetsManager.getState();
    }

    private fetchVersion(bundleName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            return fetch(`${this.remoteBundleRoot}/${bundleName}/version.manifest`).then((response: Response) => {
                if (!response.ok) {
                    reject();
                } else {
                    response.json().then((data) => {
                        resolve(data.version);
                    });
                }
            }).catch(() => {
                reject();
            });
        });
    }

    private fetchManifest(bundleName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            return fetch(`${this.remoteBundleRoot}/${bundleName}/project.manifest`).then((response: Response) => {
                if (!response.ok) {
                    reject();
                } else {
                    response.text().then((data) => {
                        resolve(data);
                    });
                }
            }).catch(() => {
                reject();
            });
        });
    }


    /**
     *  比對兩個版本新舊
     *  回傳 1 表示 remote > current
     *  回傳 0 表示 remote = current
     * @private
     * @param {string} current
     * @param {string} remote
     * @return {*}  {number}
     * @memberof BundleManager
     */
    private compare(current: string, remote: string): number {
        const splitVersionA = current.split('.').map(Number);
        const splitVersionB = remote.split('.').map(Number);

        for (let i = 0; i < splitVersionA.length; i++) {
            if (splitVersionA[i] > splitVersionB[i]) {
                return 0;
            }
            if (splitVersionA[i] < splitVersionB[i]) {
                return 1;
            }
        }

        return 0;
    }

    private onAssetsManagerUpdate(event: any): void {
        console.log(`onAssetsManagerUpdate`, event.getEventCode());
        this.state = 50 + event.getEventCode();

        if (this.state == 50 + native.EventAssetsManager.UPDATE_FINISHED) {
            this.needUpgrade = false;
        }
    }
}