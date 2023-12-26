import { _decorator, CCFloat, Component, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BasicBounce')
export class BasicBounce extends Component {

    @property({ type: CCFloat, tooltip: "停軸效果圖標偏移百分比(根據圖標高度),0~1" })
    protected OVERSPIN_PERCENT = 0.15;

    @property({ type: CCFloat, tooltip: "停軸效果表演時長,單位:秒" })
    protected OVERSPIN_DURATION = 0.1;

    @property({ type: CCFloat, tooltip: "停軸效果復原表演時長,單位:秒" })
    protected OVERSPIN_RECOVER_DURATION = 0.1;

    public play(reelHeight: number): void {
        const tween = new Tween(this.node);
        const position = this.node.position;
        tween
            .to(this.OVERSPIN_DURATION, { position: new Vec3(position.x, position.y - this.OVERSPIN_PERCENT * reelHeight, position.z) })
            .to(this.OVERSPIN_RECOVER_DURATION, { position: new Vec3(position.x, 0, position.z) })
        tween.start();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

