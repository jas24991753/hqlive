import { CCBoolean, CCFloat, CCInteger, Component, Enum, Node, Sprite, SpriteAtlas, UITransform, Vec3, _decorator, resources } from 'cc';
import { Core } from '../Core';
import { ShakeY } from '../core/effects/ShakeY';
import { Direction } from '../core/enum/Direction';
import { clamp } from '../utils/cocos/clamp';
import { delay } from '../utils/cocos/delay';
import { setPositionY } from '../utils/cocos/setPositionY';
import { ReelState } from './ReelState';
import { ReelSymbol } from './ReelSymbol';
import { SlotEvent } from './SlotEvent';
import { SlotState } from './SlotState';
import { SlotStore } from './SlotStore';
import { BasicBounce } from './effects/BasicBounce';
import { StopEffectType } from './enum/StopEffectType';
import { Stepper } from './features/Stepper';
const { ccclass, property } = _decorator;

@ccclass('Reel')
export class Reel extends Component {

    /** 隸屬的ReelSet編號 */
    public belong: number;

    /** 在該ReelSet中的index */
    public index: number;

    public springConstant = 0.1;
    public friction = 0;
    public velocity = 0;

    protected state: ReelState = ReelState.IDLE;

    private shouldMoveSymbol = false;
    private canStop = false;
    private isSymbolBlur = false;

    private passedSymbol = 0;

    protected speed = 0.02;

    private stopIndex = undefined;

    protected get TOTAL_STOP_SYMBOLS(): number {
        return this.STOP_SYMBOL_COUNT + this.node.children.length;
    }

    @property({ type: CCFloat, tooltip: "輪帶可視高度" })
    protected REEL_HEIGHT = 300;

    // @property({ type: CCFloat, tooltip: "圖標寬度" })
    // protected SYMBOL_WIDTH = 152;

    // @property({ type: CCFloat, tooltip: "圖標高度" })
    // protected SYMBOL_HEIGHT = 152;

    @property({ type: CCFloat, tooltip: "圖標間距" })
    protected GAP = 8;

    @property({ type: CCFloat, tooltip: "停輪位置Y參考" })
    protected STOP_Y = 154;

    @property({ type: CCBoolean, tooltip: "停輪是否需等待別的輪軸" })
    protected STOP_CHAIN = false;

    @property({ type: CCFloat, tooltip: "開始滾動延遲時間,單位:秒" })
    protected START_SPIN_DELAY = 0;

    @property({ type: CCFloat, tooltip: "respin表演時間,單位:秒" })
    protected RESPIN_DURATION = 2;

    @property({ type: CCFloat, tooltip: "如果不須等待輪軸,停輪延遲時間,單位:秒" })
    protected STOP_DELAY = 0;

    @property({ type: CCInteger, tooltip: "配合STOP_CHAIN,別的輪軸index" })
    protected STOP_WAIT_FOR = 0;

    @property({ type: CCFloat, tooltip: "輪軸加速delta值" })
    protected SPEED_DELTA = 0.02;

    @property({ type: CCFloat, tooltip: "輪軸轉速最小值" })
    protected MIN_SPEED = 0.02;

    @property({ type: CCFloat, tooltip: "輪軸轉速最大值" })
    protected MAX_SPEED = 0.15;

    @property({ type: CCFloat, tooltip: "停輪減速百分比,0~1,值越大減速越快" })
    protected DECELERATION_SPEED = 0.75;

    @property({ type: Enum(StopEffectType), tooltip: "停輪效果" })
    protected STOP_EFFECT_TYPE = StopEffectType.NONE;

    @property({ type: CCFloat, tooltip: "可視區上方隱藏圖標數量" })
    protected VISIBLE_UP = 1;

    @property({ type: CCFloat, tooltip: "可視區下方隱藏圖標數量" })
    protected VISIBLE_DOWN = 1;

    @property({ type: CCInteger, tooltip: "收到停輪資訊, 經過幾個圖標數才開始停輪" })
    protected STOP_SYMBOL_COUNT = 7;

    @property({ type: CCInteger, tooltip: "停輪資訊偏移量,預設為0" })
    protected STOP_SYMBOL_OFFSET = 0;

    private strip = ["B", "G", "B", "G", "R", "R", "R", "O", "B", "Y"]; // 0 ~ 11
    private stripIndex = 2;

    protected stopStripIndex: number;
    private originY: number[] = [];
    private order: number[];
    private store: SlotStore;


    start() {
        this.order = this.node.children.map((v, i) => { return i });
        this.initEvent();
        this.store = new SlotStore();
        console.log(this);
    }
    
    protected onDestroy(): void {
        new Core().event.on(SlotEvent.ON_REEL_STOPPED, this.onReelStopped,this);
    }

    protected initEvent(): void {
        new Core().event.on(SlotEvent.ON_REEL_STOPPED, this.onReelStopped,this);
    }

    protected onReelStopped(reelIndex: number): void {
        if (this.state === ReelState.SPINNING && this.STOP_CHAIN && this.STOP_WAIT_FOR === reelIndex) {
            this.state = ReelState.STOPPING;
        }
    }

    /** 圖標上移 */
    protected moveSymbol(): void {
        const lastIndex = this.order[this.order.length - 1];
        const firstIndex = this.order[0];

        const lastSymbol = this.node.children[lastIndex];
        const firstSymbol = this.node.children[firstIndex];
        const firstHeight = firstSymbol.getComponent(ReelSymbol).getSize().height / 2;
        const lastHeight = lastSymbol.getComponent(ReelSymbol).getSize().height / 2;

        const moveTo = firstHeight + this.GAP + this.node.children[firstIndex].position.y + lastHeight;

        setPositionY(lastSymbol, moveTo);
    }

    private getStripSymbol(index: number): string {
        if (index >= 0) {
            return this.strip[index % this.strip.length];
        } else if (index > this.strip.length) {
            return this.strip[(this.strip.length - index) % this.strip.length];
        } else {
            return this.strip[this.strip.length + index];
        }
    }

    private setReelStrip(stripIndex: number): void {
        resources.load('symbols', SpriteAtlas, (err, asset) => {
            const actualIndex = stripIndex - this.VISIBLE_UP;
            for (let i = 0; i < this.node.children.length; i++) {
                const symbol = this.node.children[i];
                const sprite = symbol.getComponent(Sprite);
                sprite.spriteFrame = asset.getSpriteFrame(this.strip[actualIndex + i]);
                this.originY.push(symbol.position.y);
            }
        });
    }

    private updateStripIndex(): void {
        this.stripIndex -= 1;
        if (this.stripIndex < 0) {
            this.stripIndex = this.strip.length - 1;
        }
    }

    /** 判斷是否圖標已滑出可視區 */
    private isSymbolOut(symbol: Node): boolean {
        const y = -this.REEL_HEIGHT / 2;
        const symbolHalfHeight = symbol.getComponent(UITransform).height / 2;
        return (symbol.position.y + symbolHalfHeight) <= y;
    }

    private setStripIndex(value: number): void {
        this.stripIndex = value % this.strip.length;
    }

    private updateLastSymbol(blur: boolean): void {
        const symbol = this.node.children[this.order[this.order.length - 1]];
        const key = this.getStripSymbol(this.stripIndex - this.VISIBLE_UP);
        symbol.getComponent(ReelSymbol).setSymbol(key, blur);
    }

    private calcDecelerationSpeed(): number {
        if (this.state === ReelState.SPINNING) {
            return 0;
        }

        return this.speed * this.DECELERATION_SPEED * (this.passedSymbol / this.TOTAL_STOP_SYMBOLS);
    }

    private reset(): void {
        this.state = ReelState.IDLE;
        this.shouldMoveSymbol = false;
        this.canStop = false;
        this.isSymbolBlur = false;
        this.friction = 0;
        this.passedSymbol = 0;
        this.stopIndex = undefined;
        this.speed = this.SPEED_DELTA;
    }

    private playStopEffect(): void {
        switch (this.STOP_EFFECT_TYPE) {
            case StopEffectType.BASIC_BOUNCE:
                this.getComponent(BasicBounce).play(this.REEL_HEIGHT);
                break;
            case StopEffectType.SHAKE:
                this.getComponent(ShakeY).play();
                break;
        }
    }

    /**
     * 取得指定index的圖標中心點座標
     *
     * @param {number} index - 從可視區開始計算的index
     * @return {*}  {Vec3}
     * @memberof Reel
     */
    public getSymbolPosition(index: number): Vec3 {
        const node = this.node.children[this.order[index + this.VISIBLE_UP]];
        return node.worldPosition;
    }

    public spin(): void {
        this.reset();
        this.isSymbolBlur = true;

        let delayTime = 0;
        if (this.store.state === SlotState.START_SPIN) {
            delayTime = this.START_SPIN_DELAY;
        }

        delay(delayTime).then(() => {
            this.state = ReelState.SPINNING;
        });
    }

    public respin(stripIndex: number): void {
        this.reset();
        this.isSymbolBlur = true;

        this.state = ReelState.SPINNING;

        delay(this.RESPIN_DURATION).then(() => {
            this.stopSpin(stripIndex);
        });
    }

    public stopSpin(stripIndex: number): void {

        if (this.STOP_SYMBOL_OFFSET) {
            stripIndex += this.STOP_SYMBOL_OFFSET;
            if (stripIndex >= this.strip.length) {
                stripIndex = 0;
            }
        }

        this.stopStripIndex = stripIndex;

        if (!this.STOP_CHAIN) {
            delay(this.STOP_DELAY).then(() => {
                this.state = ReelState.STOPPING;
            });
        }
    }

    public stepper(direction: Direction, amount: number): Promise<void> {
        return this.getComponent(Stepper)
            .play(this.node, direction, amount)
            .then(() => {
                return this.getComponent(ShakeY).play();
            });
    }

    update(deltaTime: number) {
        if (this.state === ReelState.IDLE) {
            return;
        }

        if (this.shouldMoveSymbol) {
            this.updateStripIndex();
            this.updateLastSymbol(this.isSymbolBlur);
            this.moveSymbol();
            const el = this.order.pop();
            this.order.unshift(el);

            if (this.state === ReelState.STOPPING) {
                this.passedSymbol += 1;
            }

            this.shouldMoveSymbol = false;
        }

        if (this.canStop) {
            this.state = ReelState.IDLE;

            this.playStopEffect();

            new Core().event.emit(SlotEvent.ON_REEL_STOPPED, this.index);

            return;
        }

        if (this.state === ReelState.STOPPING && this.passedSymbol == this.STOP_SYMBOL_COUNT) {
            this.isSymbolBlur = false;
            this.setStripIndex(this.stopStripIndex + this.node.children.length - this.VISIBLE_DOWN); // 3 + 4
        }

        if (this.state === ReelState.STOPPING && this.stripIndex === this.stopStripIndex && this.passedSymbol >= this.STOP_SYMBOL_COUNT) {
            this.stopIndex = this.order[0];
        }

        const speed = clamp(this.speed - this.calcDecelerationSpeed(), this.MIN_SPEED, this.MAX_SPEED);

        let movement = this.REEL_HEIGHT * speed;
        let stopSymbol: Node;
        let adjusted = false;
        if (this.stopIndex !== undefined) {
            stopSymbol = this.node.children[this.stopIndex];
            if (stopSymbol.position.y - movement < this.STOP_Y) {
                // 此次位移後會超出定位點，所以重新計算
                movement = Math.abs(stopSymbol.position.y - this.STOP_Y);
                adjusted = true;
            }
        }

        for (let i = this.node.children.length - 1; i >= 0; i--) {
            const symbol = this.node.children[i];
            const offset = symbol.position.y - movement;
            let newPosition = adjusted ? Math.round(offset * 100) / 100 : offset;

            setPositionY(symbol, newPosition);
        }

        if (this.isSymbolOut(this.node.children[this.order[this.order.length - 1]])) {
            this.shouldMoveSymbol = true;
        }

        if (this.stopIndex !== undefined && Math.floor(stopSymbol.position.y) === this.STOP_Y) {
            this.canStop = true;
            return;
        }

        if (this.state === ReelState.SPINNING && this.speed < this.MAX_SPEED) {
            this.speed += this.SPEED_DELTA;
        }
    }
}

