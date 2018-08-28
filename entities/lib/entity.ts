import { EntityRelationOptions, EntityConfiguration, EntityConfigurationKey, EntityFieldConfiguration, EntityFieldType } from './entity-property-configuration';
import 'reflect-metadata';
import { EntityFieldValidationConstraint } from '../../validation';

interface EntityFieldIterateble {
    fieldName: string;
    fieldConfig: EntityFieldConfiguration;
}

export interface EntityRelationConfiguration {
    propName: string;
    relationOpts: EntityRelationOptions;
}

export abstract class Entity {
    private _getEntityMetadata(): EntityConfiguration {
        return Reflect.getMetadata(EntityConfigurationKey, this);
    }

    private _getFieldsMetadata(): { [key: string]: EntityFieldConfiguration } {
        return this._getEntityMetadata().fieldConfigs;
    }

    private *_iterateOverFieldConfigs() {
        let entityFieldsMetadata = this._getFieldsMetadata();
        
        for (let entityFieldConfig in entityFieldsMetadata) {
            yield { fieldName: entityFieldConfig, fieldConfig: entityFieldsMetadata[entityFieldConfig] };
        }
    }

    private _getFieldConfigs(): EntityFieldIterateble[] {
        return [...this._iterateOverFieldConfigs()];
    }

    private _extractValues(mapper: (value: EntityFieldIterateble) => any, filter?: (value: EntityFieldIterateble) => boolean) {
        return filter ? this._getFieldConfigs().filter(filter).map(mapper) : this._getFieldConfigs().map(mapper);
    }

    public get relations(): EntityRelationConfiguration[] {
        return this._extractValues((value) => <EntityRelationConfiguration>{ propName: value.fieldName, relationOpts: value.fieldConfig.relation }, (value) => value.fieldConfig.relation !== null);
    }

    public relation(propName: string): EntityRelationOptions {
        return this._getFieldsMetadata()[propName].relation;
    }

    public get updatableProperties(): string[] {
        return this._extractValues((value) => value.fieldName, (value) => value.fieldConfig.updatable);
    }
    
    public get insertableProperties(): string[] {
        return this._extractValues((value) => value.fieldName, (value) => value.fieldConfig.insertable);
    }
    
    public get readableProperties(): string[] {
        return this._extractValues((value) => value.fieldName, (value) => value.fieldConfig.readable);
    }

    public get allProperties(): string[] {
        return this._extractValues((value) => value.fieldName);
    }

    public get belongsToUser(): boolean {
        return this._getEntityMetadata().belongsToUser;
    }

    public get entityName(): string {
        return this._getEntityMetadata().name;
    }

    public get visibleToPublic(): boolean {
        return this._getEntityMetadata().visible;
    }

    public validationRules(prop: string): EntityFieldValidationConstraint[] {
        return this._extractValues((value) => value.fieldConfig.constraints, (value) => value.fieldName === prop)[0];
    }

    public propertyType(prop: string): EntityFieldType {
        return this._extractValues((value) => value.fieldConfig.type, (value) => value.fieldName === prop)[0];
    }

    abstract customValidation?(opts?: { prevValues?: object }): { [key: string]: string };
}