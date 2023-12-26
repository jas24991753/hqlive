import { _decorator, Component, instantiate, Node, Prefab, Tween, UITransform, Vec3 } from 'cc';
import { BaseComponent } from '../core/components/BaseComponent';
import { CoreEvent } from '../core/events/CoreEvent';
import { setPositionY } from '../utils/cocos/setPositionY';
import { GameIntroItem } from './GameIntroItem';
const { ccclass, property } = _decorator;
/**
 * Live場景中, 遊戲列表UI
 *
 * @export
 * @class GameIntroMenu
 * @extends {Component}
 */
@ccclass('GameIntroMenu')
export class GameIntroMenu extends BaseComponent {

    @property({ type: Node, tooltip: "menu的主要節點" })
    menu: Node;

    @property({ type: Node, tooltip: "scrollView的content節點" })
    content: Node;

    @property({ type: Prefab, tooltip: "顯示元件prefab" })
    gameIntroItem: Prefab;

    data: any[];

    start() {
        this.node.active = false;
        this.event.on(CoreEvent.OPEN_GAME_MENU, this.open, this);

        this.node.on(Node.EventType.TOUCH_END, this.hide, this);
    }

    onClickBackground(): void {
        this.hide();
    }

    update(deltaTime: number) {

    }

    /** 載入遊戲介紹列表 */
    load(): Promise<void> {
        const data = [{ gameId: 455, intro: "" }, { gameId: 455, intro: "" }, { gameId: 455, intro: "" }];
        this.data = data;
        return Promise.resolve();
    }

    render(): void {
        let gap = 10;
        this.content.removeAllChildren();
        this.data.forEach((item, index) => {
            const node = instantiate(this.gameIntroItem);

            node.getComponent(GameIntroItem).id = index + '';

            const height = node.getComponent(UITransform).height;
            let offset = 20 + height / 2;

            const position = offset + height * index + gap * index;
            setPositionY(node, -position);

            this.content.addChild(node);
        });
    }

    open() {
        this.load().then(() => { this.render() });
        const height = this.menu.getComponent(UITransform).height;

        setPositionY(this.menu, -height);

        const tween = new Tween(this.menu);
        tween
            .to(0.2, { position: new Vec3(0, 0, 0) }, { easing: "expoOut" })
        tween.start();

        this.node.active = true;
    }

    hide() {
        const height = this.menu.getComponent(UITransform).height;

        const tween = new Tween(this.menu);
        tween
            .to(0.2, { position: new Vec3(0, -height, 0) }, {
                easing: "expoOut", onComplete: () => {
                    this.node.active = false;
                }
            })
        tween.start();

    }
}

