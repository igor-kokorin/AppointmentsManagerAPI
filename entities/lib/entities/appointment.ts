import { Entity } from '../../index';
import { EntityField, EntityType, EntityFieldOperation } from '../entity-property-configuration';

@EntityType.Entity({ belongsToUser: true, visible: true })
export class Appointment extends Entity {
    @EntityField.AllowedOperations({ allowedOperations: [ EntityFieldOperation.Read ] })
    @EntityField.Id()
    public id: string;

    @EntityField.AllowedOperations({ allowedOperations: [ EntityFieldOperation.Read, EntityFieldOperation.Insert, EntityFieldOperation.Update ] })
    @EntityField.Required()
    @EntityField.String({ minLength: 1, maxLength: 50 })
    public title: string;
    
    @EntityField.AllowedOperations({ allowedOperations: [ EntityFieldOperation.Read, EntityFieldOperation.Insert, EntityFieldOperation.Update ] })
    @EntityField.String({ maxLength: 500 })
    public description: string;
    
    @EntityField.AllowedOperations({ allowedOperations: [ EntityFieldOperation.Read, EntityFieldOperation.Insert, EntityFieldOperation.Update ] })
    @EntityField.Required()
    @EntityField.Date()
    public dateTime: Date;
    
    @EntityField.AllowedOperations({ allowedOperations: [ EntityFieldOperation.Read, EntityFieldOperation.Insert, EntityFieldOperation.Update ] })
    @EntityField.ForeignId()
    @EntityField.Relatation({ savedInDataStore: true, preventsDeletion: false, otherEndEntityName: 'Address' })
    public address: string;
    
    @EntityField.AllowedOperations({ allowedOperations: [ EntityFieldOperation.Read, EntityFieldOperation.Insert, EntityFieldOperation.Update ] })
    @EntityField.ForeignIds({ minCount: 1, maxCount: 5 })
    @EntityField.Relatation({ savedInDataStore: true, preventsDeletion: false, otherEndEntityName: 'Contact' })
    public contacts: string[];

    public customValidation(opts: { prevValues: object }) {
        let prevDateTime = (<Appointment>opts.prevValues).dateTime;
        let currDateTime = this.dateTime;

        if (prevDateTime.getTime() > currDateTime.getTime()) {
            return { temporalError: 'New dateTime cannot be earlier than previous value' };
        }
    }
}