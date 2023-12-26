import { EventTarget } from "cc";
import { Defer } from "../utils/Defer";
import { RequestData } from "./RequestData";
import { ResponseData } from "./ResponseData";

/**
 * 發送/接收server資訊
 *
 * @export
 * @class DeferResponse
 */
export class DeferResponse<T1 extends RequestData, T2 extends ResponseData> {

    private defer: Defer<T2> | null = null;

    private requestEventName: string;

    private respEventName: string;

    private failEventName: string;

    protected event: EventTarget;

    constructor(requestEventName: string, respEventName?: string, failEventName?: string) {
        this.event = window.eventEmitter;
        if (respEventName) {
            this.event.on(respEventName, this.recv, this);
        }
        if (failEventName) {
            this.event.on(failEventName, this.error, this);
        }

        this.requestEventName = requestEventName;
        this.respEventName = respEventName;
        this.failEventName = failEventName;
    }

    public send(data: T1): Promise<T2> {
        this.event.emit(this.requestEventName, data);
        if (!this.respEventName) {
            return Promise.resolve(null);
        }
        this.defer = new Defer();
        return this.defer.promise;
    }

    protected recv(data: T2): void {
        if (!this.defer) {
            return;
        }
        this.defer.resolve(data);
        this.defer = null;
    }

    protected error(data: any): void {
        if (!this.defer) {
            return;
        }
        this.defer.reject(data);
        this.defer = null;
    }

    public destroy(): void {
        if (this.respEventName) {
            this.event.off(this.respEventName, this.recv, this);
        }
        if (this.failEventName) {
            this.event.off(this.failEventName, this.error, this);
        }
    }
}