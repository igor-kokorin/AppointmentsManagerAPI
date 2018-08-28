import { EntityFieldType } from '../../entities/lib/entity-property-configuration';

export interface StringMinLengthOptions {
    minLength: number;
}

export interface StringMaxLengthOptions {
    maxLength: number;
}

export interface NumberMinValueOptions {
    minValue: number;
}

export interface NumberMaxValueOptions {
    maxValue: number;
}

export interface IdsMinCountOptions {
    minCount: number;
}

export interface IdsMaxCountOptions {
    maxCount: number;
}

export enum ValidationRule {
    Required,
    StringMinLength,
    StringMaxLength,
    Id,
    NumberMinValue,
    NumberMaxValue,
    IdsMinCount,
    IdsMaxCount
}

export interface EntityFieldValidationConstraint {
    rule: ValidationRule;
    options?: any;
}

export interface EntityFieldValidationConstraintTyped<TValidationRuleOptions> extends EntityFieldValidationConstraint {
    rule: ValidationRule;
    options?: TValidationRuleOptions;
}

export class ValidationRulesHelper {
    private static _uppercaseFirstCharacter(value: string) {
        return value.slice(0, 1).toUpperCase() + value.slice(1);
    }

    public static entityFieldTypeToValidationConstraint(fieldType: EntityFieldType, entityFieldTypeOpt?: object) {
        let entityFieldTypeName = EntityFieldType[fieldType].replace(/foreign/i, '');
        let constraintName: string = this._uppercaseFirstCharacter(entityFieldTypeName);

        if (entityFieldTypeOpt) {
            constraintName += this._uppercaseFirstCharacter(Object.getOwnPropertyNames(entityFieldTypeOpt)[0]);
        }

        return constraintName in ValidationRuleFactory ? ValidationRuleFactory[constraintName](entityFieldTypeOpt) : null;
    }
}

export class ValidationRuleFactory {
    public static Required(): EntityFieldValidationConstraintTyped<null> {
        return { rule: ValidationRule.Required, options: null };
    }
    
    public static StringMinLength(opts: StringMinLengthOptions): EntityFieldValidationConstraintTyped<StringMinLengthOptions> {
        return { rule: ValidationRule.StringMinLength, options: opts };
    }

    public static StringMaxLength(opts: StringMaxLengthOptions): EntityFieldValidationConstraintTyped<StringMaxLengthOptions> {
        return { rule: ValidationRule.StringMaxLength, options: opts };
    }

    public static Id(): EntityFieldValidationConstraintTyped<null> {
        return { rule: ValidationRule.Id, options: null };
    }

    public static NumberMinValue(opts: NumberMinValueOptions): EntityFieldValidationConstraintTyped<NumberMinValueOptions> {
        return { rule: ValidationRule.NumberMinValue, options: opts };
    }

    public static NumberMaxValue(opts: NumberMaxValueOptions): EntityFieldValidationConstraintTyped<NumberMaxValueOptions> {
        return { rule: ValidationRule.NumberMaxValue, options: opts };
    }

    public static IdsMinCount(opts: IdsMinCountOptions): EntityFieldValidationConstraintTyped<IdsMinCountOptions> {
        return { rule: ValidationRule.IdsMinCount, options: opts };
    }

    public static IdsMaxCount(opts: IdsMaxCountOptions): EntityFieldValidationConstraintTyped<IdsMaxCountOptions> {
        return { rule: ValidationRule.IdsMaxCount, options: opts };
    }
}