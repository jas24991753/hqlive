import { _decorator, director } from 'cc';
import { BaseComponent } from '../core/components/BaseComponent';
const { ccclass, property } = _decorator;

@ccclass('GameLoading')
export class GameLoading extends BaseComponent {
    start() {
        const bundleManager = window.application.bundleManager;

        const gameId = window.application.store.gameId;

        console.log("開始載入 bundle:" + gameId);

        // const loader = new BundleLoader("demo", null, bundleManager.bundleServerUrl);
        // loader.start(true);

        bundleManager.load(gameId).then(() => {
            console.log("bundle載入完成");
            director.loadScene("LiveStreaming", () => { });
        });
    }
}

