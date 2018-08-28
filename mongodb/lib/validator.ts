import { Validator, ValidatorValidateOptions, ValidatorResult, ValidationMessageFactory } from '../../validation';
import { Document, SchemaDefinition } from 'mongoose';
import * as _ from 'underscore';

export interface MongoDbValidationRuleConfiguration {
    customValidator: boolean;
    mongooseValidatorName?: string;
    validatorFactory?: (...args) => (value: any) => boolean;
}

export enum MongoDbValidationRule {
    Required,
    StringMinLength,
    StringMaxLength,
    ArrayMinLength,
    ArrayMaxLength,
    ArrayElementString
}

const MongoDbValidationRules: { [key: string]: MongoDbValidationRuleConfiguration } = {
    Required: { customValidator: false, mongooseValidatorName: 'required' },
    StringMinLength: { customValidator: false, mongooseValidatorName: 'minlength' },
    StringMaxLength: { customValidator: false, mongooseValidatorName: 'maxlength' },
    ArrayMinLength: {
        customValidator: true,
        validatorFactory: function (opts: { minLength: number }) {
            return function (value: any[]) {
                return value.length >= opts.minLength;
            }
        }
    },
    ArrayMaxLength: {
        customValidator: true,
        validatorFactory: function (opts: { maxLength: number }) {
            return function (value: any[]) {
                return value.length <= opts.maxLength;
            }
        }
    },
    ArrayElementString: {
        customValidator: true,
        validatorFactory: function (opts?: { stringMinLength?: number, stringMaxLength?: number }) {
            _.extendOwn(opts, { stringMinLength: 0, stringMaxLength: 1000 });

            return function (value: any[]) {
                return value.filter(
                    (element) => (typeof element !== 'string')
                    || ((element.length < opts.stringMinLength) || (element.length > opts.stringMaxLength))
                ).length === 0;
            }
        }
    }
}

export class MongoDbValidator implements Validator {
    public validate(opts: { entity: Document }): ValidatorResult {
        let validationResult = {};
        let errors = opts.entity.validateSync()['errors'];

        if (errors === undefined) {
            return null;
        }

        for (let error in errors) {
            let validatorError = errors[error];

            if (validatorError['name'] === 'CastError') {
                validationResult[error] = ValidationMessageFactory.TypeMismatch(, { : validatorError['kind'] }); 
            } else {
                validationResult[error] = ;
            }
        }
        
        return validationResult;
    }
}

export class MongoDbValidationRuleFactory {
    public static setRuleOnSchemaDefinition(opts: { propName: string, schemaDef: SchemaDefinition, validationRule: MongoDbValidationRule, validationRuleOptions: any }) {
        let rule = MongoDbValidationRules[opts.validationRule];
        let validationErrorMessage = ValidationMessageFactory[opts.validationRule](opts.propName, opts.validationRuleOptions);

        if (rule.customValidator) {
            let customValidatorsOnSchema = opts.schemaDef.validate ? <any[]>opts.schemaDef.validate : [];
            customValidatorsOnSchema.push({
                validator: rule.validatorFactory(opts.validationRuleOptions),
                msg: validationErrorMessage
            });
            opts.schemaDef.validate = customValidatorsOnSchema;
        } else {
            let validationRuleConstraint: any;

            if (rule.mongooseValidatorName === 'required') {
                validationRuleConstraint = true;
            } else {
                validationRuleConstraint = opts.validationRuleOptions[Object.getOwnPropertyNames(opts.validationRuleOptions)[0]];
            }

            opts.schemaDef[rule.mongooseValidatorName] = [ validationRuleConstraint, validationErrorMessage ] ;
        }
    }
}