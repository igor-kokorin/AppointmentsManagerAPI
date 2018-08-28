import { Schema, model, SchemaTypes } from 'mongoose';
import { ValidationMessageFactory } from '../../../validation';

let appointmentsSchema = new Schema({
    title: {
        type: SchemaTypes.String,
        minlength: [ 1, ValidationMessageFactory.stringMinLength('title', 1) ],
        maxlength: [ 30, ValidationMessageFactory.stringMaxLength('title', 30) ],
        required: [ true, ValidationMessageFactory.required('title') ]
    },
    description: {
        type: SchemaTypes.String,
        maxlength: 200
    },
    dateTime: {
        type: SchemaTypes.Date
    },
    addressId: {
        type: SchemaTypes.String,
        ref: 'Address',
        required: true
    },
    contactsId: {
        type: SchemaTypes.Array,
        ref: 'Contact',
        required: true
    }
});

model('Appointment', appointmentsSchema, 'appointments');