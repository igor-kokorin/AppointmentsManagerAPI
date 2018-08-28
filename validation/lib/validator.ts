export interface ValidatorValidateOptions {
    entity: object;
    prevValues?: object;
}

export interface ValidatorResult {
    [key: string]: object;
}

export interface Validator {
    validate(opts: ValidatorValidateOptions): ValidatorResult;
}