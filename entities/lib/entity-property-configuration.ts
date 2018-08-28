import 'reflect-metadata';
import { ValidationRuleFactory, EntityFieldValidationConstraint, ValidationRule, ValidationRulesHelper } from '../../validation';
import * as _ from 'underscore';

export const EntityConfigurationKey = Symbol('EntityConfigurationKey');

export enum EntityFieldConstraints {
    StringMaxLength = 500,
    ForeignIdsMaxCount = 100
}

export enum EntityFieldType {
    Id, ForeignId, ForeignIds, String, Number, Date
}

export enum EntityFieldOperation {
    Read, Insert, Update
}

export interface OperationEntityFieldOptions {
    allowedOperations: EntityFieldOperation[];
}

export interface StringEntityFieldTypeOptions {
    minLength?: number;
    maxLength?: number;
}

export interface NumberEntityFieldTypeOptions {
    minValue?: number;
    maxValue?: number;
}

export interface ForeignIdsEntityFieldTypeOptions {
    minCount?: number;
    maxCount?: number;
}

export interface EntityOptions {
    name?: string;
    visible?: boolean;
    belongsToUser?: boolean;
}

export interface EntityRelationOptions {
    otherEndEntityName: string;
    preventsDeletion: boolean;
    savedInDataStore: boolean;
}

export interface EntityConfiguration {
    name: string;
    visible: boolean;
    belongsToUser: boolean;
    fieldConfigs: { [key: string]: EntityFieldConfiguration };
}

export interface EntityFieldConfiguration {
    type: EntityFieldType;
    updatable: boolean;
    insertable: boolean;
    readable: boolean;
    constraints: EntityFieldValidationConstraint[];
    relation?: EntityRelationOptions;
}

 export class EntityFieldTypeToConstraintsMapper {
    public static map(entityFieldType: EntityFieldType, entityFieldTypeOpts: object): EntityFieldValidationConstraint[] {
        let constraints = <EntityFieldValidationConstraint[]>[];

        if (entityFieldTypeOpts) {
            for (let option in entityFieldTypeOpts) {
                let constraint = ValidationRulesHelper.entityFieldTypeToValidationConstraint(entityFieldType, { [option]: entityFieldTypeOpts[option] });

                if (constraint) {
                    constraints.push(constraint);
                }
            }
        } else {
            let constraint = ValidationRulesHelper.entityFieldTypeToValidationConstraint(entityFieldType);
            
            if (constraint) {
                constraints.push(constraint);
            }
        }

        return constraints;
    }
}

class EntityFieldConfigurationHelper {
    private static _configureEntityField(target: any, fieldName: string, entityFieldConfigurer: (fieldConfig: EntityFieldConfiguration) => void) {
        let fieldConfig = EntityMetadataAccessor.getEntityFieldConfig(target, fieldName);

        entityFieldConfigurer(fieldConfig);

        EntityMetadataAccessor.setEntityFieldConfig(target, fieldName, fieldConfig);
    }

    public static configureType(target: any, fieldName: string, fieldType: EntityFieldType, fieldTypeOpts?: any) {
        this._configureEntityField(target, fieldName, (fieldConfig: EntityFieldConfiguration) => {
            fieldConfig.type = fieldType;
            fieldConfig.constraints = fieldConfig.constraints.concat(EntityFieldTypeToConstraintsMapper.map(fieldType, fieldTypeOpts));
        });
    }

    public static configureOperations(target: any, fieldName: string, fieldOperationsOpts: OperationEntityFieldOptions) {
        this._configureEntityField(target, fieldName, (fieldConfig: EntityFieldConfiguration) => {
            for (let op of fieldOperationsOpts.allowedOperations) {
                if (op === EntityFieldOperation.Read) {
                    fieldConfig.readable = true;
                }

                if (op === EntityFieldOperation.Insert) {
                    fieldConfig.insertable = true;
                }

                if (op === EntityFieldOperation.Update) {
                    fieldConfig.updatable = true;
                }
            }
        });
    }

    public static configureRelation(target: any, fieldName: string, relationOpts: EntityRelationOptions) {
        this._configureEntityField(target, fieldName, (fieldConfig: EntityFieldConfiguration) => {
            fieldConfig.relation = relationOpts;
        });
    }

    public static configureValidationConstraint(target: any, fieldName: string, validationConstraint: EntityFieldValidationConstraint) {
        this._configureEntityField(target, fieldName, (fieldConfig: EntityFieldConfiguration) => {
            fieldConfig.constraints.push(validationConstraint);
        });
    }
}

class EntityMetadataAccessor {
    public static getEntityConfig(target: any): EntityConfiguration {
        let entityConfig: EntityConfiguration = Reflect.getMetadata(EntityConfigurationKey, target);

        if (!entityConfig) {
            entityConfig = { name: target.constructor.name, belongsToUser: false, visible: false, fieldConfigs: {} };
        }

        return entityConfig;
    }

    public static setEntityConfig(target: any, entityConfig: EntityConfiguration) {
        Reflect.defineMetadata(EntityConfigurationKey, entityConfig, target);
    }

    public static getEntityFieldConfig(target: any, fieldName: string): EntityFieldConfiguration {
        let fieldConfig: EntityFieldConfiguration = EntityMetadataAccessor.getEntityConfig(target).fieldConfigs[fieldName];

        if (!fieldConfig) {
            fieldConfig = { type: EntityFieldType.String, relation: null, constraints: [], updatable: false, insertable: false, readable: false };
        }

        return fieldConfig;
    }

    public static setEntityFieldConfig(target: any, fieldName: string, entityFieldConfig: EntityFieldConfiguration) {
        let entityConfig: EntityConfiguration = EntityMetadataAccessor.getEntityConfig(target);
        entityConfig.fieldConfigs[fieldName] = entityFieldConfig;
        EntityMetadataAccessor.setEntityConfig(target, entityConfig);
    }
}

class EntityConfigurationHelper {
    public static configureEntity(target: any, entityOpts: EntityOptions) {
        let entityConfig: EntityConfiguration = EntityMetadataAccessor.getEntityConfig(target);

        _.extendOwn(entityConfig, entityOpts);
        EntityMetadataAccessor.setEntityConfig(target, entityConfig);

        EntityFieldConfigurationHelper.configureType(target, 'userId', EntityFieldType.ForeignId);
    }
}

export namespace EntityType {
    export function Entity(opts: EntityOptions) {
        return function (constructor: Function) {
            EntityConfigurationHelper.configureEntity(constructor.prototype, opts);
        }
    }
}

export namespace EntityField {
    export function Number(opts: NumberEntityFieldTypeOptions) {
        return function (target: any, fieldName: string) {
            EntityFieldConfigurationHelper.configureType(target, fieldName, EntityFieldType.Number, opts);
        };
    }

    export function Date() {
        return function (target: any, fieldName: string) {
            EntityFieldConfigurationHelper.configureType(target, fieldName, EntityFieldType.Date);
        };
    }

    export function String(opts: StringEntityFieldTypeOptions) {
        opts = _.extendOwn({ maxLength: EntityFieldConstraints.StringMaxLength }, opts);

        return function (target: any, fieldName: string) {
            EntityFieldConfigurationHelper.configureType(target, fieldName, EntityFieldType.String, opts);
        };
    }

    export function Id() {
        return function (target: any, fieldName: string) {
            EntityFieldConfigurationHelper.configureType(target, fieldName, EntityFieldType.Id);
        };
    }

    export function ForeignId() {
        return function (target: any, fieldName: string) {
            EntityFieldConfigurationHelper.configureType(target, fieldName, EntityFieldType.ForeignId);
        };
    }

    export function ForeignIds(opts: ForeignIdsEntityFieldTypeOptions) {
        return function (target: any, fieldName: string) {
            opts = _.extendOwn({ maxLength: EntityFieldConstraints.ForeignIdsMaxCount }, opts);

            EntityFieldConfigurationHelper.configureType(target, fieldName, EntityFieldType.ForeignIds, opts);
        };
    }

    export function Relatation(opts: EntityRelationOptions) {
        return function (target: any, fieldName: string) {
            EntityFieldConfigurationHelper.configureRelation(target, fieldName, opts);
        };
    }

    export function AllowedOperations(opts: OperationEntityFieldOptions) {
        return function (target: any, fieldName: string) {
            EntityFieldConfigurationHelper.configureOperations(target, fieldName, opts);
        };
    }

    export function Required() {
        return function (target: any, fieldName: string) {
            EntityFieldConfigurationHelper.configureValidationConstraint(target, fieldName, ValidationRuleFactory.Required());
        };
    }
}