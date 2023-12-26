import { isNative } from "../utils/platform/isNative";
import { Store } from "./Store";
import { NativeHandler } from "./app/NativeHandler";
import { singleton } from "./decorators/singleton";
import { Platform } from "./enum/Platform";
import { BundleManager } from "./managers/bundle/BundleManager";
@singleton
export class Application {
    platform: Platform = Platform.NATIVE;

    native: NativeHandler;

    store: Store;

    bundleManager: BundleManager;

    constructor() {
        this.native = new NativeHandler();
        this.store = new Store();
        this.bundleManager = new BundleManager();
    }

    public init(): void {
        this.native.init();
        this.bundleManager.bundleServerUrl = "http://192.168.17.215/bundles";
        if (isNative()) {
            this.bundleManager.init(["demo"]);
        }
    }
}