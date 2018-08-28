import { RequiredError, MustBeGtThanOrEq, MustBeLtThanOrEq, MustBeNonEmptyError, NotOfProperTypeError, Type, ObjectHelper } from '../index';
import { assert } from 'chai';
import * as _ from 'underscore';

export interface BaseTesterOptions {
    opts: any;
    optName: string;
}

export abstract class BaseTester {
    protected _opts: any;
    protected _optName: string;

    constructor(opts: BaseTesterOptions) {
        this._opts = opts.opts;
        this._optName = opts.optName;
    }

    protected _copyOpts() {
        return _.clone(this._opts);
    }

    public abstract _callSUT(opts: any);

    public isAbsent() {
        let self = this;

        it(`${self._optName} not present throws an exception`, function () {
            let optsCopy = self._copyOpts();

            ObjectHelper.removeProperty(optsCopy, self._optName);
            assert.throw(() => self._callSUT(optsCopy), RequiredError, new RegExp(self._optName));

            ObjectHelper.setPropertyValue(optsCopy, self._optName, undefined);
            assert.throw(() => self._callSUT(optsCopy), RequiredError, new RegExp(self._optName));

            ObjectHelper.setPropertyValue(optsCopy, self._optName, null);
            assert.throw(() => self._callSUT(optsCopy), RequiredError, new RegExp(self._optName));
        });

        return this;
    }
    
    public isEmpty() {
        let self = this;

        it(`${self._optName} that is empty throws an exception`, function () {
            let optsCopy = self._copyOpts();

            if ((optsCopy[self._optName] instanceof Array) || (optsCopy[self._optName] instanceof Set)) {
                
                ObjectHelper.setPropertyValue(optsCopy, self._optName, (optsCopy[self._optName] instanceof Array) ? <any>[] : <any>new Set());    
                assert.throw(() => self._callSUT(optsCopy), MustBeNonEmptyError, new RegExp(self._optName));
            
            } else if (typeof ObjectHelper.getPropertyValue(optsCopy, self._optName) === Type.STRING) {
                
                for (let val of ['', ' ', '   ', '          ' ]) {
                    ObjectHelper.setPropertyValue(optsCopy, self._optName, val);
                    assert.throw(() => self._callSUT(optsCopy), MustBeNonEmptyError, new RegExp(self._optName));
                }

            } else {

                ObjectHelper.setPropertyValue(optsCopy, self._optName, {});
                assert.throw(() => self._callSUT(optsCopy), MustBeNonEmptyError, new RegExp(self._optName));
            
            }
        });

        return this;
    }

    private _notInBlacklist(typeName: string, blackList: any[], message: string, errorType: Function) {
        let self = this;

        it(`${self._optName} ${message} throws an exception`, function () {
            let optsCopy = self._copyOpts();

            if (typeName) {

                for (let val of blackList) {
                    ObjectHelper.setPropertyValue(optsCopy, self._optName, val);
                    
                    assert.throw(() => self._callSUT(optsCopy),
                        errorType, 
                        (errorType instanceof NotOfProperTypeError)
                            ? new RegExp(`(${self._optName})+.*(${typeName})+`)
                            : new RegExp(`${self._optName}`)
                    );
                }

            } else {
                assert.fail(null, null, 'Expected typeName parameter to be non empty string.');
            }
        });
    }

    public isNotAnInteger() {
        this._notInBlacklist(Type.INTEGER, [ 56.784, '45', { a: 34, b: '999' }, true ], 'is not an integer', NotOfProperTypeError);
        return this;
    }
    
    public isNotGtThanOrEqTo(lowerBoundIncl: number | string) {
        if (typeof lowerBoundIncl === 'number') {
            this._notInBlacklist(Type.NUMBER, [ lowerBoundIncl - 1, lowerBoundIncl - 23, lowerBoundIncl - 4, lowerBoundIncl - 134 ], `is not greater than or equal to ${lowerBoundIncl}`, MustBeGtThanOrEq);
        } else {
            let path = lowerBoundIncl;
            lowerBoundIncl = Number(ObjectHelper.getPropertyValue(this._opts, path));
            this._notInBlacklist(Type.NUMBER, [ lowerBoundIncl - 1, lowerBoundIncl - 23, lowerBoundIncl - 4, lowerBoundIncl - 134 ], `is not greater than or equal to ${path}`, MustBeGtThanOrEq);
        }

        return this;
    }

    public isNotLtThanOrEqTo(upperBoundIncl: number | string) {
        if (typeof upperBoundIncl === 'number') {
            this._notInBlacklist(Type.INTEGER, [ upperBoundIncl + 1, upperBoundIncl + 56, upperBoundIncl + 8, upperBoundIncl + 3 ], `is not less than or equal to ${upperBoundIncl}`, MustBeLtThanOrEq);
        } else {
            let path = upperBoundIncl;
            upperBoundIncl = Number(ObjectHelper.getPropertyValue(this._opts, path));
            this._notInBlacklist(Type.INTEGER, [ upperBoundIncl + 1, upperBoundIncl + 56, upperBoundIncl + 8, upperBoundIncl + 3 ], `is not less than or equal to ${path}`, MustBeLtThanOrEq);
        }

        return this;
    }
    
    public isNotANumber() {
        this._notInBlacklist(Type.NUMBER, [ '45', { a: 34, b: '999' }, true ], 'is not a number', NotOfProperTypeError);
        return this;
    }
    
    public isNotA(type: Function | string) {
        let typeName = (type instanceof Function) ? type.name : type;
        
        this._notInBlacklist(typeName, [ 45, 'string', { a: 34, b: '999' }, true ], `is not a ${typeName}`, NotOfProperTypeError);

        return this;
    }
    
    public isNotAString() {
        this._notInBlacklist(Type.STRING, [ 45, { a: 34, b: '999' }, true ], 'is not a string', NotOfProperTypeError);
        return this;
    }
    
    public isNotABoolean() {
        this._notInBlacklist(Type.BOOLEAN, [ 45, 'string', { a: 34, b: '999' } ], 'is not a boolean', NotOfProperTypeError);
        return this;
    }
    
    public isNotAnObject() {
        this._notInBlacklist(Type.OBJECT, [ 45, 'string', true ], 'is not an object', NotOfProperTypeError);
        return this;
    }
}