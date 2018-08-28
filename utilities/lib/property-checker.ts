import { RequiredError, NotOfProperTypeError, MustBeGtThanOrEq, MustBeLtThanOrEq, MustBeNonEmptyError, Type, ObjectHelper } from '../index';

export function PropertyCheckerFactory(obj, propertyName) {
    return new PropertyChecker(propertyName, ObjectHelper.getPropertyValue(obj, propertyName));
}

export class PropertyChecker {
    constructor(private propertyName: string, private value: any) {
    }

    public isPresent() {
        if ((typeof this.value === 'undefined') || (this.value === null)) {
            throw new RequiredError(this.propertyName);
        }

        return this;
    }

    public isInteger() {
        if (!Number.isInteger(this.value)) {
            throw new NotOfProperTypeError(this.propertyName, Type.INTEGER);
        }

        return this;
    }

    public isLtThanOrEqTo(upperBoundIncl: number) {
        if (this.value > upperBoundIncl) {
            throw new MustBeLtThanOrEq(this.propertyName, upperBoundIncl);
        }

        return this;
    }

    public isGtThanOrEqTo(lowerBoundIncl: number) {
        if (this.value < lowerBoundIncl) {
            throw new MustBeGtThanOrEq(this.propertyName, lowerBoundIncl);
        }

        return this;
    }

    public isNumber() {
        if (!Number.isNaN(this.value)) {
            throw new NotOfProperTypeError(this.propertyName, Type.NUMBER);
        }

        return this;
    }

    public isString() {
        if (!(typeof this.value === Type.STRING)) {
            throw new NotOfProperTypeError(this.propertyName, Type.STRING);
        }

        return this;
    }

    public isNotEmpty() {
        if (typeof this.value === Type.STRING) {
            if (!(<string>this.value).trim()) {
                throw new MustBeNonEmptyError(this.propertyName);
            }
        } else if (this.value instanceof Array) {
            if (!(<any[]>this.value).length) {
                throw new MustBeNonEmptyError(this.propertyName);
            }
        } else if (this.value instanceof Set) {
            if (!(<Set<any>>this.value).size) {
                throw new MustBeNonEmptyError(this.propertyName);
            }
        } else {
            if (Object.getOwnPropertyNames(this.value).length === 0) {
                throw new MustBeNonEmptyError(this.propertyName);
            }
        }

        return this;
    }

    public isBoolean() {
        if (!(typeof this.value === Type.BOOLEAN)) {
            throw new NotOfProperTypeError(this.propertyName, Type.BOOLEAN);
        }

        return this;
    }

    public isObject() {
        if (!(typeof this.value === Type.OBJECT)) {
            throw new NotOfProperTypeError(this.propertyName, Type.OBJECT);
        }

        return this;
    }

    public isOfType(type: Function | string) {
        let typeName = (type instanceof Function) ? type.name : type;

        if (type instanceof Function) {
            if (!(this.value instanceof type)) {
                throw new NotOfProperTypeError(this.propertyName, typeName);
            }
        } else {
            if (this.value.name !== type) {
                throw new NotOfProperTypeError(this.propertyName, typeName);
            }
        }

        return this;
    }
}