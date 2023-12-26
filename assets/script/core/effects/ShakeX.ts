import { _decorator, CCFloat, CCInteger, Component } from "cc";
import { setPositionX } from "../../utils/cocos/setPositionX";

const { ccclass, property } = _decorator;

@ccclass('ShakeX')
export class ShakeX extends Component {

    @property({ type: CCFloat, tooltip: '震動時長,單位:秒' })
    protected DURATION: number = 1;

    @property({ type: CCFloat, tooltip: '震動強度' })
    protected POWER: number = 1;

    @property({ type: CCInteger, tooltip: '取樣點數量' })
    protected FREQ: number = 200;

    private t: number;

    private isShaking: boolean = false;

    private samples: number[] = [];

    public start(): void {
        this.t = 0;
        this.isShaking = false;
        const sampleCount = (this.DURATION) * this.FREQ;
        this.samples = [];
        for (var i = 0; i < sampleCount; i++) {
            this.samples.push(Math.random() * 2 - 1);
        }
    }

    public run(): void {
        this.reset();
        this.isShaking = true;
    }

    public reset(): void {
        this.t = 0;
        this.isShaking = false;
    }

    public update(diff: number): void {
        if (!this.isShaking) {
            return;
        }

        if (this.t > this.DURATION) {
            this.isShaking = false;
            return;
        }
        const amp = this.amplitude(this.t) * this.POWER;

        setPositionX(this.node, amp);

        this.t += diff;
    }

    public amplitude(t: number): number {
        if (t == undefined) {
            // return zero if we are done shaking
            if (!this.isShaking) return 0;
            t = this.t;
        }
        // Get the previous and next sample
        var s = t / this.DURATION * this.FREQ;
        var s0 = Math.floor(s);
        var s1 = s0 + 1;

        // Get the current decay
        var k = this.decay(t);

        // Return the current amplitide 
        return (this.noise(s0) + (s - s0) * (this.noise(s1) - this.noise(s0))) * k;
    }

    private noise(s: number): number {
        // Retrieve the randomized value from the samples
        if (s >= this.samples.length) return 0;
        return this.samples[s];
    }

    private decay(t: number): number {
        if (t >= this.DURATION) return 0;
        return (this.DURATION - t) / this.DURATION;
    }

}