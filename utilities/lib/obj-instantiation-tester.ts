import { RequiredError, MustBeGtThanOrEq, MustBeLtThanOrEq, MustBeNonEmptyError, NotOfProperTypeError, Type, ObjectHelper } from '../index';
import { assert } from 'chai';
import * as _ from 'underscore';
import { BaseTester, BaseTesterOptions } from './base-tester';

export class ObjectInstantiationTesterFactory {
    public static forOptionsPropertyTest(SUTConstructor: Function, constructorOpts: any, optName: string) {
        return new ObjectInstantiationTester({ SUTConstructor, opts: constructorOpts, optName });
    }

    public static forInstantiationTest(SUTConstructor: Function, constructorOpts: any) {
        return new ObjectInstantiationTester({ SUTConstructor, opts: constructorOpts, optName: undefined });
    }

    public static forInheritanceTest(SUTConstructor: Function) {
        return new ObjectInstantiationTester({ SUTConstructor, opts: undefined, optName: undefined });
    }
}

export interface ObjectInstantiationTesterOptions extends BaseTesterOptions {
    SUTConstructor: Function;
}

class ObjectInstantiationTester extends BaseTester {
    private _SUTConstructor: Function;

    constructor(opts: ObjectInstantiationTesterOptions) {
        super(opts);

        this._SUTConstructor = opts.SUTConstructor;
    }

    public _callSUT(opts: any): any {
        return (new (<any>this._SUTConstructor)(opts));
    }

    public inheritsFrom(baseType: Function) {
        let self = this;

        it(`inherits from ${baseType.name}`, function () {
            assert.isTrue(self._SUTConstructor.prototype instanceof baseType);
        });
    }

    public isCreatedSuccessfully() {
        let self = this;

        describe(`creating ${self._SUTConstructor.name} with valid parameters`, function () {
            it(`sets ${self._SUTConstructor.name} options to passed values`, function () {
                let SUT = self._callSUT(self._opts);
                assert.deepInclude(SUT, self._opts);
            });
        });
    }

    private _isPrimitive(value: any): boolean {
        return (
            (typeof value === Type.NUMBER) || (typeof value === Type.BOOLEAN) || (typeof value === Type.STRING)
        );
    }

    public setsDefaultValue(defaultValue: any) {
        let self = this;
        
        it(`${self._optName} is not present sets ${self._optName} to default value=${JSON.stringify(defaultValue)}`, function () {
            let optsCopy = self._copyOpts();

            ObjectHelper.removeProperty(optsCopy, self._optName);

            if (self._isPrimitive(defaultValue)) {
                assert.strictEqual(self._callSUT(optsCopy)[self._optName], defaultValue);
            } else {
                assert.deepEqual(self._callSUT(optsCopy)[self._optName], defaultValue);
            }
        });
        
        return this;
    }
}