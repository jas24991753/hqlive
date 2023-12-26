import { Tween, Vec3, _decorator, sp } from 'cc';
import StateSet from '../../../script/core/stateMachine/StateSet';
import { BaseSlotGame } from '../../../script/slot/BaseSlotGame';
import { SlotState } from '../../../script/slot/SlotState';
import { SlotStateSets } from '../../../script/slot/SlotStateSets';
import { Background } from '../../../script/slot/components/Background';
import { CountingNumber } from '../../../script/slot/components/CountingNumber';
import { GraphicWinline } from '../../../script/slot/components/winline/GraphicWinline';
const { spine } = sp;
const { AnimationStateData } = spine;

const { ccclass, property } = _decorator;

export enum CharacterAnimations {
    IDLE = 'Caishen_Character_Idle',
    WIN = 'Caishen_Character_Win',
    BIG_WIN = 'Caishen_Character_BigWin',
    EXTREMNE_BIG_WIN = 'Caishen_Character_ExtremeBigWin',
    ULTRA_EXTREME_BIG_WIN = 'Caishen_Character_UltraExtremeBigWin',
    FEATURE_TRIGGER = 'Caishen_Character_FeatureTrigger',
    REEL_SPIN = 'Caishen_Character_ReelSpin'
}

@ccclass('Demo')
export class Demo extends BaseSlotGame {

    @property(sp.Skeleton)
    animation: sp.Skeleton;

    @property(Background)
    background: Background;

    @property(CountingNumber)
    winText: CountingNumber;

    @property(GraphicWinline)
    winline: GraphicWinline;

    protected initComponentManager(): void {
        this.componentManager.setComponentOrder([
            this.background,
            this.reelSet
        ]);
    }

    protected init(): void {
        this.winText.hook(10, () => {
            const tween = new Tween(this.winText.node)
                .to(0.5, { scale: new Vec3(1.2, 1.2, 1) })
            tween.start();
        });
        this.winText.hook(50, () => {
            const tween = new Tween(this.winText.node)
                .to(0.5, { scale: new Vec3(1.5, 1.5, 1) })
            tween.start();
        });

        const stateSet: StateSet = new StateSet(SlotStateSets.IDLE);
        this.stateMachine.push(stateSet.toArray());
        console.log('財神v1.0.5');
    }

    IDLE(): void {
        this.animation.setAnimation(0, CharacterAnimations.IDLE, true);
    }

    hideSwapButton(): void {
        this.swapButton.node.active = false;
    }

    showSwapButton(): void {
        this.swapButton.node.active = true;
    }

    hideMinimizeButton(): void {
        this.minimizeButton.node.active = false;
    }

    showMinimizeButton(): void {
        this.minimizeButton.node.active = true;
    }

    setLiveDisplay(): void {
        this.background.node.active = false;
        this.animation.node.active = false;
    }

    setDefaultDisplay(): void {
        this.background.node.active = true;
        this.animation.node.active = true;
    }

    triggerSpin(): void {
        super.triggerSpin();
        this.winline.clear();
        this.winText.hide();
    }

    triggerStopSpin(): void {
        const stateSet: StateSet = new StateSet(SlotStateSets.ON_RESULT);
        // stateSet.setStateData(SlotState.TRIGGER_STEPPER, { reel: 0, direction: Direction.UP, amount: 1 });
        stateSet.setStateData(SlotState.SHOWING_BIG_WIN, 10000);
        this.stateMachine.push(stateSet.toArray(), true);
    }

    SHOWING_ALL_WINLINE(): void {
        const el = this.winline;
        const line = [0, 1, 0];
        const line2 = [0, 1, 2];
        const reelSet = this.reelSet;
        const position = line.map((symbolIndex, reelIndex) => { return reelSet.getSymbolPosition(reelIndex, symbolIndex) });
        const position2 = line2.map((symbolIndex, reelIndex) => { return reelSet.getSymbolPosition(reelIndex, symbolIndex) });
        el.draw([position, position2]);
    }

    // @compare(CompareOp.GT)
    SHOWING_BIG_WIN(value: number): void {
        this.winText.run(value);
    }
}

