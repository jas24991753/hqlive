import { _decorator, Component, Graphics, UITransform } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 背景純色填充
 *
 * @export
 * @class Background
 * @extends {Component}
 */
@ccclass('BackgroundFiller')
export class BackgroundFiller extends Component {

    public get graphics(): Graphics {
        return this.node.getComponent(Graphics);
    }

    fill() {
        const parentInfo = this.node.parent.getComponent(UITransform);
        const graphics = this.node.getComponent(Graphics);
        graphics.rect(-parentInfo.width / 2, -parentInfo.height / 2, parentInfo.width, parentInfo.height);
        graphics.fill();
    }

    start() {
        this.fill();
    }

    update(deltaTime: number) {

    }
}

