import { _decorator, Component, Size, Sprite, SpriteAtlas, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReelSymbol')
export class ReelSymbol extends Component {

    @property({ type: SpriteAtlas, tooltip: "資源" })
    protected res: SpriteAtlas;

    public setSymbol(key: string, blur: boolean): void {
        const sprite = this.getComponent(Sprite);
        let blurStr = blur ? '_b' : '';
        sprite.spriteFrame = this.res.getSpriteFrame(`${key}${blurStr}`);
        this.getComponent(UITransform).setContentSize(sprite.spriteFrame.originalSize);
    }

    public getSize(): Size {
        const sprite = this.getComponent(Sprite);
        return sprite.spriteFrame.originalSize;
    }

    start() {
    }

    update(deltaTime: number) {

    }
}

