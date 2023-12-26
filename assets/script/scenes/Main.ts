import { Node, Prefab, Sprite, SpriteFrame, _decorator, director, instantiate, math, resources } from 'cc';
import { BaseComponent } from '../core/components/BaseComponent';
import { VerticalItemAligner } from '../core/components/VerticalItemAligner';
import { PageSwitch } from '../core/components/pageSwitch/PageSwitch';
import { FontTab } from '../core/components/tab/FontTab';
import { CoreEvent } from '../core/events/CoreEvent';
import { GUIEvent } from '../core/events/GUIEvent';
import { NativeEvent } from '../core/events/NativeEvent';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends BaseComponent {

    @property({ type: Prefab })
    liveItem: Prefab = null;

    @property({ type: Prefab })
    gameItem: Prefab = null;

    @property({ type: VerticalItemAligner })
    liveItems: VerticalItemAligner = null;

    @property({ type: VerticalItemAligner })
    gameItems: VerticalItemAligner = null;

    @property({ type: FontTab })
    tab: FontTab = null;

    @property({ type: PageSwitch })
    container: PageSwitch = null;

    @property({ type: Node })
    test: Node = null;

    loaded: { [key: number]: boolean } = {};

    private onClickLiveItem(): void {
        window.application.store.focusTarget = 'live';
        this.transitionToLive('');
    }

    private onClickGameItem(data, e): void {
        window.application.store.focusTarget = 'game';
        window.application.store.gameId = data.gameId;

        const bundleLoader = window.application.bundleManager.getBundleLoader(data.gameId);

        if (bundleLoader.canUpgrade()) {
            this.transitionToGameLoading();
        } else {
            // 遊戲已是最新, 直接轉場
            this.transitionToGame('');
        }
    }

    private transitionToGameLoading(): void {
        director.loadScene("GameLoading", () => { });
    }

    private transitionToLive(id: string): void {
        console.log('開啟直播', id);
        director.loadScene("LiveStreaming", () => { });
        this.event.emit(NativeEvent.JSB_OPEN_LIVE_STREAMING);
    }

    private transitionToGame(gameId: string): void {
        console.log('開啟遊戲', gameId);
        director.loadScene("LiveStreaming", () => { });
    }

    loadDefaultImg(): Promise<SpriteFrame> {
        return new Promise((resolve) => {
            resources.load(`components/ui/live-block/spriteFrame`, SpriteFrame, (err, asset) => {
                resolve(asset);
            });
        });
    }

    load(index: number): void {
        // 模擬lazy load
        const array = this.getList();
        this.loadDefaultImg().then((asset) => {
            switch (index) {
                case 0: // live
                    this.setPreloadItem(asset, 5, this.onClickLiveItem, null);

                    break;
                case 1: // game
                    this.setPreloadItem(asset, 5, this.onClickGameItem, { gameId: "demo" });
                    break;
            }
            for (let i = 0; i < array.length; i++) {
                resources.load(array[i], SpriteFrame, (err, asset) => {
                    this.scheduleOnce(() => {
                        this.getContainer().updateItem(i, asset);
                    }, math.randomRange(0.12, 0.79));
                });
                this.loaded[index] = true;
            }
        });
    }

    getList(): string[] {
        switch (window.application.store.focusTabIndex) {
            case 0:
                return ['001', '002', '003', '005', '006'].map((item) => `live/example/${item}/spriteFrame`);
            case 1:
                return ['ancient_disco', 'bounty_raid_2', 'bugsy\'s_bar', 'case_closed', 'santa_spins'].map((item) => `components/gameList/${item}/spriteFrame`);
        }
    }

    getContainer(): VerticalItemAligner {
        switch (window.application.store.focusTabIndex) {
            case 0:
                return this.liveItems;
            case 1:
                return this.gameItems;
        }
    }

    setPreloadItem(asset: SpriteFrame, count: number, onclick: Function, data: any): void {
        for (let i = 0; i < count; i++) {
            const output = {
                spriteFrame: asset,
                prefab: instantiate(this.liveItem)
            };
            const sprite = output.prefab.getChildByName('Sprite').getComponent(Sprite);
            sprite.spriteFrame = output.spriteFrame;
            output.prefab.on(Node.EventType.TOUCH_END, onclick.bind(this, data), this);

            this.getContainer().add(output);
        }
    }

    triggerSwitchTab(data): void {
        window.application.store.focusTabIndex = data.current;
    }

    onSwitchTo(index: number): void {
        if (!this.loaded[index]) {
            this.load(index);
        }
    }

    start() {
        this.event.on(GUIEvent.TRIGGER_SWITCH_TAB, this.triggerSwitchTab, this);
        this.event.on(CoreEvent.TRANSITION_TO_LIVE, this.transitionToLive, this);
        this.event.on(CoreEvent.TRANSITION_TO_GAME, this.transitionToGame, this);

        this.load(window.application.store.focusTabIndex);

        this.container.onSwitchTo = this.onSwitchTo.bind(this);
    }

    protected onDestroy(): void {
        this.event.off(CoreEvent.TRANSITION_TO_LIVE, this.transitionToLive, this);
        this.event.off(CoreEvent.TRANSITION_TO_GAME, this.transitionToGame, this);
        this.event.off(GUIEvent.TRIGGER_SWITCH_TAB, this.triggerSwitchTab, this);
    }

    update(deltaTime: number) {

    }
}


