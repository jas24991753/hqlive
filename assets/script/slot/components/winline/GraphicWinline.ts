import { _decorator, CCInteger, Component, Graphics, UITransform, Vec3 } from 'cc';
import { delay } from '../../../utils/cocos/delay';
const { ccclass, property } = _decorator;

@ccclass('GraphicWinline')
export class GraphicWinline extends Component {

    el: Graphics;

    @property({ type: CCInteger, tooltip: '兩側延伸長度,px' })
    LENGTH: number = 0;

    @property({ type: CCInteger, tooltip: '多條線每條間隔多久顯示,單位:秒' })
    DELAY: number = 0;

    public draw(lines: Vec3[][]): Promise<any> {
        const promises = [];
        lines.forEach((positions, index) => {

            const p = delay(this.DELAY * index);
            promises.push(p);
            p.then(() => {
                positions.forEach((position, index) => {
                    const transform = this.getComponent(UITransform);
                    const local = transform.convertToNodeSpaceAR(position);

                    if (index === 0) {
                        if (this.LENGTH > 0) {
                            this.el.moveTo(local.x - this.LENGTH, local.y);
                            this.el.lineTo(local.x, local.y);
                        }
                        this.el.moveTo(local.x, local.y);
                    } else {
                        this.el.lineTo(local.x, local.y);
                    }

                    if (index === positions.length - 1 && this.LENGTH > 0) {
                        this.el.lineTo(local.x + this.LENGTH, local.y);
                    }
                });
                this.el.stroke();

            });
        });

        return Promise.all(promises);
    }

    public clear(): void {
        this.el.clear();
    }

    start() {
        this.el = this.getComponent(Graphics);
    }

    update(deltaTime: number) {

    }
}

