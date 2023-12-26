import { CCInteger, Graphics, Vec3, _decorator } from 'cc';
import { Core } from '../Core';
import { Defer } from '../utils/Defer';
import { BaseReelSet } from './BaseReelSet';
import { Reel } from './Reel';
import { SlotEvent } from './SlotEvent';
import { SlotState } from './SlotState';
import { SlotStore } from './SlotStore';
const { ccclass, property } = _decorator;

@ccclass('ReelSet')
export class ReelSet extends BaseReelSet {

    @property({ type: Reel, tooltip: '12345' })
    reel1: Reel | null = null;

    @property(Reel)
    reel2: Reel | null = null;

    @property(Reel)
    reel3: Reel | null = null;

    @property({ type: CCInteger, tooltip: "最後停輪的輪軸index" })
    WAIT_FOR_REEL: number = 2;

    reels: Reel[] = [];

    allReelStopped: Defer;

    protected store: SlotStore;

    start() {
        super.start();
        this.init();
        this.initEvent();
        // test
        const graphic = this.node.addComponent(Graphics);
        graphic.lineWidth = 2;
        graphic.lineJoin = 1;
        graphic.lineCap = 1;
        graphic.strokeColor.set(255, 0, 0, 255);
        graphic.fillColor.set(0, 255, 0, 255);
        graphic.moveTo(this.node.position.x - 300, 0);
        graphic.lineTo(this.node.position.x + 300, 0);
        graphic.stroke();
    }

    protected onDestroy(): void {
        new Core().event.off(SlotEvent.ON_REEL_STOPPED, this.onReelStopped, this);
    }

    init() {
        this.store = new SlotStore();
        this.reels = [this.reel1, this.reel2, this.reel3];
        for (let i = 0; i < this.reels.length; i++) {
            this.reels[i].index = i;
        }
    }

    initEvent() {
        new Core().event.on(SlotEvent.ON_REEL_STOPPED, this.onReelStopped, this);
    }

    public getSymbolPosition(reelIndex: number, symbolIndex: number): Vec3 {
        return this.reels[reelIndex].getSymbolPosition(symbolIndex);
    }


    START_SPIN(data: any): Promise<void> {
        this.reels.forEach((reel) => {
            reel.spin();
        });

        return Promise.resolve();
    }

    TRIGGER_RESPIN(data: any): Promise<void> {
        this.store.respinReelCount = 1;
        this.store.currentStopReelCount = 0;
        this.reels[0].respin(6);
        this.allReelStopped = new Defer();
        return this.allReelStopped.promise;
    }

    TRIGGER_STEPPER(data: any): Promise<void> {
        return this.reels[data.reel].stepper(data.direction, data.amount);
    }

    STOPPING_SPIN(data: any): Promise<void> {
        this.reel1.stopSpin(3);
        this.reel2.stopSpin(3);
        this.reel3.stopSpin(3);

        this.allReelStopped = new Defer();

        return this.allReelStopped.promise;
    }

    onReelStopped(index: number): void {
        if (this.store.state === SlotState.STOPPING_SPIN && index === this.WAIT_FOR_REEL) {
            this.allReelStopped.resolve();
        }

        if (this.store.state === SlotState.TRIGGER_RESPIN) {
            this.store.currentStopReelCount++;
        }

        if (this.store.state === SlotState.TRIGGER_RESPIN && this.store.currentStopReelCount === this.store.respinReelCount) {
            this.allReelStopped.resolve();
        }
    }

    update(deltaTime: number) {
    }
}

