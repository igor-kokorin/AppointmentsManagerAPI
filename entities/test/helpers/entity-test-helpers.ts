import { Entity, EntityFactory } from '../../index';
import { Validator, ValidationMessageFactory, ValidatorValidateOptions, ValidationRule, EntityFieldValidationConstraint, ValidationRuleFactory } from '../../../validation';
import * as _ from 'underscore';
import { assert } from 'chai';
import { StringEntityFieldTypeOptions, EntityFieldType, NumberEntityFieldTypeOptions, EntityRelationOptions, EntityFieldTypeToConstraintsMapper, ForeignIdsEntityFieldTypeOptions } from '../../lib/entity-property-configuration';

class EntityPropertyTypeTestHelper {
    private static _checkType(entity: Entity, propName: string, type: EntityFieldType) {
        assert.strictEqual(entity.propertyType(propName), type, `${propName} must be a ${EntityFieldType[type]}`);
    }

    private static _checkValidationConstraints(entity: Entity, propName: string, fieldTypeOpts: any) {
        let constraints = EntityFieldTypeToConstraintsMapper.map(entity.propertyType(propName), fieldTypeOpts);

        for (let constraint of constraints) {
            let validationRule = entity.validationRules(propName).find((value) => value.rule === constraint.rule);
            assert.isDefined(validationRule, `${propName} must have ${ValidationRule[constraint.rule]} rule`);
    
            if (constraint.options) {
                assert.deepEqual(validationRule.options, constraint.options, 'validation rule options must be equal to' + JSON.stringify(constraint.options));
            }
        }
    }

    public static Id(entity: Entity, propName: string) {
        let testCaseTitle = `${propName} must be an Id`;

        it(testCaseTitle, function () {
            EntityPropertyTypeTestHelper._checkType(entity, propName, EntityFieldType.Id);
            EntityPropertyTypeTestHelper._checkValidationConstraints(entity, propName, null);
        });
    }

    public static ForeignId(entity: Entity, propName: string) {
        let testCaseTitle = `${propName} must be a ForeignId`;

        it(testCaseTitle, function () {
            EntityPropertyTypeTestHelper._checkType(entity, propName, EntityFieldType.ForeignId);
            EntityPropertyTypeTestHelper._checkValidationConstraints(entity, propName, null);
        });
    }

    public static ForeignIds(entity: Entity, propName: string, opts: ForeignIdsEntityFieldTypeOptions) {
        let testCaseTitle = `${propName} must be a ForeignIds `
            + (opts.minCount || opts.maxCount ? 'which contains ' : '')
            + (opts.minCount ? 'from ' + opts.minCount + ' ' : '')
            + (opts.maxCount ? 'up to ' + opts.maxCount + ' ' : '')
            + (opts.minCount | opts.maxCount ? 'ids' : '');

        it(testCaseTitle, function () {
            EntityPropertyTypeTestHelper._checkType(entity, propName, EntityFieldType.ForeignIds);
            EntityPropertyTypeTestHelper._checkValidationConstraints(entity, propName, opts);
        });
    }

    public static String(entity: Entity, propName: string, opts: StringEntityFieldTypeOptions) {
        let testCaseTitle = `${propName} must be a String `
            + (opts.minLength || opts.maxLength ? 'which ' : '')
            + (opts.minLength ? 'minimum length is ' + opts.minLength : '')
            + (opts.minLength && opts.maxLength ? ' and ' : '')
            + (opts.maxLength ? 'maximum length is ' + opts.maxLength : '');

        it(testCaseTitle, function () {
            EntityPropertyTypeTestHelper._checkType(entity, propName, EntityFieldType.String);
            EntityPropertyTypeTestHelper._checkValidationConstraints(entity, propName, opts);
        });
    }

    public static Number(entity: Entity, propName: string, opts: NumberEntityFieldTypeOptions) {
        let testCaseTitle = 'must be a Number '
            + (opts.minValue ? 'from ' + opts.minValue + ' ' : '' )
            + (opts.maxValue ? 'up to ' + opts.maxValue + ' '  : '')
            + (opts.maxValue | opts.minValue ? 'inclusive' : '';

        it(testCaseTitle, function () {
            EntityPropertyTypeTestHelper._checkType(entity, propName, EntityFieldType.Number);
            EntityPropertyTypeTestHelper._checkValidationConstraints(entity, propName, opts);
        });
    }

    public static Date(entity: Entity, propName: string) {
        let testCaseTitle = `${propName} must be a Date`;

        it(testCaseTitle, function () {
            EntityPropertyTypeTestHelper._checkType(entity, propName, EntityFieldType.Date);
        });
    }
}

export class EntityTestHelper {
    public entity: Entity;

    constructor(opts: { entity: Entity }) {
        this.entity = opts.entity;
    }

    public HasName(entityName: string) {
        let self = this;

        it('have a name ' + entityName, function () {
            assert.strictEqual(self.entity.entityName, entityName);
        });

        return this;
    }

    public Property(propName: string) {
        return new EntityPropertyTestHelper({ entity: this.entity, propName });
    }

    public BelongsToUser() {
        let self = this;

        it('must be attached to particular user', function () {
            assert.isTrue(self.entity.belongsToUser);
        });

        return this;
    }

    public VisibleToPublic() {
        let self = this;

        it('must be visisble to outside world', function () {
            assert.isTrue(self.entity.visibleToPublic);
        });

        return this;
    }
}

export class EntityPropertyTestHelper {
    public entity: Entity;
    public propName: string;

    constructor(opts: { entity: Entity, propName: string }) {
        this.entity = opts.entity;
        this.propName = opts.propName;
    }

    public Property(propName: string) {
        return new EntityPropertyTestHelper({ entity: this.entity, propName });
    }

    public IsRelation(opts: EntityRelationOptions) {
        let self = this;
        
        describe(`is a relation to ${opts.otherEndEntityName} which`, function () {
            if (opts.preventsDeletion) {
                it('prevents removal of current entity (first other end must be deleted)', function () {
                    assert.isTrue(self.entity.relation(self.propName).preventsDeletion);
                });
            }

            if (opts.savedInDataStore) {
                it('saved in data store', function () {
                    assert.isTrue(self.entity.relation(self.propName).savedInDataStore);
                });
            }
        });

        return this;
    }

    public IsString(opts: StringEntityFieldTypeOptions) {
        EntityPropertyTypeTestHelper.String(this.entity, this.propName, opts);
        return this;
    }

    public IsId() {
        EntityPropertyTypeTestHelper.Id(this.entity, this.propName);
        return this;
    }

    public IsForeignId() {
        EntityPropertyTypeTestHelper.ForeignId(this.entity, this.propName);
        return this;
    }

    public IsForeignIds(opts: ForeignIdsEntityFieldTypeOptions) {
        EntityPropertyTypeTestHelper.ForeignIds(this.entity, this.propName, opts);
        return this;
    }

    public IsNumber(opts: NumberEntityFieldTypeOptions) {
        EntityPropertyTypeTestHelper.Number(this.entity, this.propName, opts);
        return this;
    }

    public IsDate() {
        EntityPropertyTypeTestHelper.Date(this.entity, this.propName);
        return this;
    }

    public IsReadable() {
        let self = this;

        it(`${this.propName} must be readable`, function () {
            assert.isDefined(self.entity.readableProperties.find(value => value === self.propName));
        });

        return this;
    }

    public IsInsertable() {
        let self = this;

        it(`${this.propName} must be insertable`, function () {
            assert.isDefined(self.entity.insertableProperties.find(value => value === self.propName));
        });
        
        return this;
    }

    public IsUpdateable() {
        let self = this;

        it(`${this.propName} must be updatable`, function () {
            assert.isDefined(self.entity.updatableProperties.find(value => value === self.propName));
        });
        
        return this;
    }
}