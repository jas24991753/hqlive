import { _decorator, CCString, Component, instantiate, Node, Prefab, resources, Sprite, SpriteFrame } from 'cc';
import { StreamerItem } from './StreamerItem';
const { ccclass, property } = _decorator;

/**
 * 直播列表載入器
 *
 * @export
 * @class StreamerListLoader
 * @extends {Component}
 */
@ccclass('StreamerListLoader')
export class StreamerListLoader extends Component {

    @property(Node)
    layout: Node;

    @property(CCString)
    type: string = '';

    @property({ type: Prefab })
    target: Prefab = null;

    start() {
        let array = [];
        switch (this.type) {
            case 'hot':
                array = ['live1', 'live2', 'live3'];
                break;
            case 'latest':
                array = ['live4', 'live5'];
                break;
        }

        array.forEach((filename) => {
            let node = instantiate(this.target);
            const item = node.addComponent(StreamerItem);
            const sprite = node.getChildByName('head').getComponent(Sprite);
            resources.load(`live/${this.type}/${filename}/spriteFrame`, SpriteFrame, (err, asset) => {
                sprite.spriteFrame = asset;
                item.id = filename;
                this.layout.addChild(node);
            });
        })

    }

    update(deltaTime: number) {

    }
}

