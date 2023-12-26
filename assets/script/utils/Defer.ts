export class Defer {
    private _promise: Promise<any>;

    public get promise(): Promise<any> {
        return this._promise;
    }

    private _resolve;
    private _reject;

    constructor() {
        this._promise = new Promise<any>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public resolve(): void {
        this._resolve();
    }

    public reject(): void {
        this._reject();
    }
}