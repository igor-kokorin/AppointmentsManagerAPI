import { Schema, model, SchemaTypes } from 'mongoose';

let usersSchema = new Schema({
    googleId: {
        type: SchemaTypes.String
    },
    fullName: {
        type: SchemaTypes.String
    }
});

model('users', usersSchema);