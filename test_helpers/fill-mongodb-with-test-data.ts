import { MongoClient, Collection, Db, InsertWriteOpResult } from 'mongodb';
import reshapeDataForMongoDb from './reshape-data-for-mongodb';
import * as Promise from 'bluebird';
import * as _ from 'underscore';

class DbTestData {
    private static _fillAppointmentsCollection(db: Db, appointments: AppointmentsManager.IAppointment[]) {
        return db
            .collection('appointments')
            .insertMany(reshapeDataForMongoDb(appointments));
    }
    
    private static _fillContactsCollection(db: Db, contacts: AppointmentsManager.IContact[]) {
        return db
            .collection('contacts')
            .insertMany(reshapeDataForMongoDb(contacts));
    }

    private static _fillAddressesCollection(db: Db, addresses: AppointmentsManager.IAddress[]) {
        return db
            .collection('addresses')
            .insertMany(reshapeDataForMongoDb(addresses));
    }

    public static fillAllCollections(db: Db, testDataBucket: AppointmentsManager.TestDataBucket) {
        return Promise.cast(db.dropDatabase()).then(() => {
            return Promise.all([
                DbTestData._fillAppointmentsCollection(db, testDataBucket.appointments)
                , DbTestData._fillContactsCollection(db, testDataBucket.contacts)
                , DbTestData._fillAddressesCollection(db, testDataBucket.addresses)
            ]);
        });
    }
}

export default function fillDbWithTestData(testDataBucket: AppointmentsManager.TestDataBucket) {
    return Promise.cast(MongoClient.connect('mongodb://localhost:27017')).then((client) => {
        let db = client.db('appointments_manager');
        return DbTestData
            .fillAllCollections(db, testDataBucket)
            .finally(() => {
                client.close();
            });
    });
}