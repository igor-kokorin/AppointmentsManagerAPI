export class RequiredError extends Error {
    constructor(propertyName: string) {
        super(`${propertyName} is required`);
    }
}

export class MustBeGtThanOrEq extends RangeError {
    constructor(propertyName: string, lowerBoundIncl: number) {
        super(`${propertyName} must be greater than or equal to ${lowerBoundIncl}`);
    }
}

export class MustBeLtThanOrEq extends RangeError {
    constructor(propertyName: string, upperBoundIncl: number) {
        super(`${propertyName} must be less than or equal to ${upperBoundIncl}`);
    }
}

export enum Type {
    NUMBER = 'number',
    INTEGER = 'integer',
    BOOLEAN = 'boolean',
    STRING = 'string',
    OBJECT = 'object'
}

export class NotOfProperTypeError extends TypeError {
    constructor(propertyName: string, typeName: string) {
        super(`${propertyName} must be of type ${typeName}`);
    }
}

export class MustBeNonEmptyError extends Error {
    constructor(propertyName: string) {
        super(`${propertyName} must be non empty`);
    }
}