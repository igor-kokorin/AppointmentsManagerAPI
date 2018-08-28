import { Schema, model, Mongoose, SchemaTypes } from 'mongoose';

let addressesSchema = new Schema({
    title: {
        type: SchemaTypes.String
    },
    addressLine: {
        type: SchemaTypes.String
    },
    coordinates: {
        latitude: {
            type: SchemaTypes.Number
        },
        longtitude: {
            type: SchemaTypes.Number
        }
    }
});

model('Address', addressesSchema, 'addresses');