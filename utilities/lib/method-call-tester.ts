import { BaseTester, BaseTesterOptions } from './base-tester';

export function MethodCallTesterFactory(opts: MethodCallTesterOptions) {
    return new MethodCallTester(opts);
}

export interface MethodCallTesterOptions extends BaseTesterOptions {
    obj: object;
    methodName: string;
}

class MethodCallTester extends BaseTester {
    private _obj: object;
    private _methodName: string;

    constructor(opts: MethodCallTesterOptions) {
        super(opts);

        this._obj = opts.obj;
        this._methodName = opts.methodName; 
    }
    
    public _callSUT(opts: any): any {
        return this._obj[this._methodName](opts);
    }
}