import { _decorator, Button, instantiate, Node, Prefab, resources } from 'cc';
import { BaseComponent } from '../core/components/BaseComponent';
import { CoreEvent } from '../core/events/CoreEvent';
import { GameIntroMenu } from '../live/GameIntroMenu';
const { ccclass, property } = _decorator;

/**
 * LiveStreaming場景進入口
 *
 * @export
 * @class LiveStreaming
 * @extends {BaseComponent}
 */
@ccclass('LiveStreaming')
export class LiveStreaming extends BaseComponent {

    @property(Node)
    gameIntroMenuNode: Node;

    @property(Node)
    canvas: Node;

    @property(Button)
    swapButton: Button;

    @property(Node)
    liveUI: Node;

    @property({ type: Button })
    liveButton: Button;

    @property({ type: Button })
    gameButton: Button;

    gameNode: Node;

    private get gameComponent(): any {
        return this.gameNode.getComponent('Demo');
    }

    openGame(data: any): void {
        this.gameIntroMenuNode.getComponent(GameIntroMenu).hide();
        resources.load(`prefabs/slot/Demo`, Prefab, (err, asset) => {
            const node = instantiate(asset);
            this.gameNode = node;
            this.canvas.addChild(node);
            this.gameComponent.showSwapButton();
        });
    }

    focusGame(): void {
        this.gameComponent.hideSwapButton();
        this.gameComponent.setDefaultDisplay();
    }

    focusLive(): void {
        window.application.store.focusTarget = 'live';
        this.gameComponent.setLiveDisplay();
        this.gameComponent.showSwapButton();
        this.gameComponent.showMinimizeButton();
    }

    onLiveStreamingOpened(): void {
        window.application.store.isLiveStreaming = true;
        if (window.application.store.focusTarget === 'game') {
            this.gameComponent.hideSwapButton();
        }
    }

    start() {
        if (window.application.store.focusTarget === 'live') {
            this.liveUI.active = true;
            this.liveButton.node.active = false;
            this.gameButton.node.active = true;
            window.application.store.isLiveStreaming = true;
        } else {
            this.gameButton.node.active = false;
            this.liveButton.node.active = true;
            const bundleManager = window.application.bundleManager;

            bundleManager.loadBundle('demo').then((bundle) => {
                bundle.load(`prefab/Demo`, Prefab, (err, asset) => {
                    const node = instantiate(asset);
                    this.gameNode = node;
                    this.canvas.addChild(node);
                    this.gameComponent.hideSwapButton();
                });
            });
        }
        this.event.on(CoreEvent.OPEN_GAME, this.openGame, this);
        this.event.on(CoreEvent.FOCUS_LIVE, this.focusLive, this);
        this.event.on(CoreEvent.FOCUS_GAME, this.focusGame, this);
        this.event.on(CoreEvent.APP_LIVE_STREAMING_OPENED, this.onLiveStreamingOpened, this);
    }

    protected onDestroy(): void {
        this.event.off(CoreEvent.OPEN_GAME, this.openGame, this);
        this.event.off(CoreEvent.FOCUS_LIVE, this.focusLive, this);
        this.event.off(CoreEvent.FOCUS_GAME, this.focusGame, this);
        this.event.off(CoreEvent.APP_LIVE_STREAMING_OPENED, this.onLiveStreamingOpened, this);
    }

    update(deltaTime: number) {

    }
}

