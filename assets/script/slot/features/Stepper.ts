import { _decorator, CCFloat, CCInteger, Component, Node, Tween, Vec3 } from 'cc';
import { Direction } from '../../core/enum/Direction';
const { ccclass, property } = _decorator;

@ccclass('Stepper')
export class Stepper extends Component {

    @property({ type: CCInteger, tooltip: "步進位移量,px" })
    protected STEP_UNIT = 20;

    @property({ type: CCFloat, tooltip: "每次步進表演時間,單位:秒" })
    protected DURATION = 0.4;

    public play(node: Node, direction: Direction, amout: number): Promise<void> {
        let offset = (direction === Direction.UP) ? this.STEP_UNIT * amout : this.STEP_UNIT * amout * -1;

        return new Promise((resolve) => {
            node.children.forEach((symbol, index) => {
                const position = symbol.position;
                const tween = new Tween(symbol);
                tween
                    .to(this.DURATION, { position: new Vec3(position.x, position.y + offset, position.z) })
                    .call(() => {
                        if (index === node.children.length - 1) {
                            resolve();
                        }
                    })
                tween.start();
            });

        });
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

