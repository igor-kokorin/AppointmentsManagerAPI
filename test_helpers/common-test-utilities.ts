import generateGoodTestData from './test-data-generator';
import fillDbWithTestData from './fill-mongodb-with-test-data';
import * as Promise from 'bluebird';
import { MongoClient, Db } from 'mongodb';

export function executeWithinMongoDb(fn: (Db) => Promise<any>) {
    let c: MongoClient;

    Promise.cast(MongoClient.connect('mongodb://localhost:27017'))
        .then((client) => {
            c = client;
            return fn(client.db('appointments_manager'));
        })
        .finally(() => {
            if (c) {
                c.close();
            }
        });
}

export function prepareDbForTests(): Promise<AppointmentsManager.TestDataBucket> {
    let goodTestDataBucket = generateGoodTestData();

    return fillDbWithTestData(goodTestDataBucket).then((result) => {
        return goodTestDataBucket;
    });
}