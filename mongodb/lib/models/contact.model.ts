import { Schema, model, Mongoose, SchemaTypes } from 'mongoose';

let contactsSchema = new Schema({
    firstName: {
        type: SchemaTypes.String
    },
    lastName: {
        type: SchemaTypes.String
    },
    middleName: {
        type: SchemaTypes.String
    },
    company: {
        type: SchemaTypes.String
    },
    phoneNumbers: {
        type: SchemaTypes.Array
    }
});

model('Contact', contactsSchema, 'contacts');