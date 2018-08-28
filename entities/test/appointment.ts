import { ObjectInstantiationTesterFactory } from '../../utilities';
import { EntityTestHelper } from './helpers';
import { Appointment } from '../lib/entities/appointment';

describe('Appointment', function () {
    let appointment = new Appointment();

    let entityTestHelper = new EntityTestHelper({ entity: appointment });
    entityTestHelper
        .HasName('Appointment')
        .BelongsToUser()
        .VisibleToPublic()
        .Property('id')
            .IsId()
        .Property('title')
            .IsString({ minLength: 1, maxLength: 50 }).IsReadable().IsInsertable().IsUpdateable()
        .Property('description')
            .IsString({ maxLength: 500 }).IsReadable().IsInsertable().IsUpdateable()
        .Property('dateTime')
            .IsDate().IsReadable().IsInsertable().IsUpdateable()
        .Property('address')
            .IsRelation({ otherEndEntityName: 'Address', preventsDeletion: false, savedInDataStore: true })
            .IsForeignId()
            .IsReadable().IsInsertable().IsUpdateable()
        .Property('contacts')
            .IsRelation({ otherEndEntityName: 'Contact', preventsDeletion: false, savedInDataStore: true })
            .IsForeignIds({ minCount: 1, maxCount: 5 })
            .IsReadable().IsInsertable().IsUpdateable();
});