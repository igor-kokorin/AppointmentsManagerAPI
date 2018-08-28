import { StringMaxLengthOptions, StringMinLengthOptions, ArrayMaxLengthOptions, ArrayMinLengthOptions, ArrayElementStringOptions, TypeMismatchOptions } from '../index';

export class ValidationMessageFactory {
    public static Required(propName: string) {
        return `${propName} must be present`;
    }

    public static StringMaxLength(propName: string, validatorOpts: StringMaxLengthOptions) {
        return `${propName} must be at most ${validatorOpts.maxLength} characters`;
    }

    public static StringMinLength(propName: string, validatorOpts: StringMinLengthOptions) {
        return `${propName} must be at least ${validatorOpts.minLength} characters`;
    }

    public static ArrayMaxLength(propName: string, validatorOpts: ArrayMaxLengthOptions) {
        return `${propName} must be an array of length at most ${validatorOpts.maxLength}`;
    }

    public static ArrayMinLength(propName: string, validatorOpts: ArrayMinLengthOptions) {
        return `${propName} must be an array of length at least ${validatorOpts.minLength}`;
    }

    public static ArrayElementString(propName: string, validatorOpts: ArrayElementStringOptions) {
        return `${propName} must be an array whose elements are string with lengths from ${validatorOpts.stringMinLength} to ${validatorOpts.stringMaxLength}`;
    }

    public static TypeMismatch(propName: string, validatorOpts: TypeMismatchOptions) {
        return `${propName} must be of type ${validatorOpts.requiredType}`;
    }
}