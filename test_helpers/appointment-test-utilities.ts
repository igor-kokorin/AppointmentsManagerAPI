import { Response } from 'superagent';
import * as deepCopy from 'deep-copy';
import * as _ from 'underscore';

export class AppointmentFactory {
    public static fromMongoDocument(document: any): AppointmentsManager.IAppointment {
        let appointment = (<any>deepCopy)(document);
        appointment.id = appointment._id;
        appointment.dateTime = new Date(appointment.dateTime);
        appointment = _.omit(appointment, '_id');
        return appointment;
    }
    
    public static fromResponse(response: Response): AppointmentsManager.IAppointment {
        let appointment = (<any>deepCopy)(response.body.result);
        appointment.dateTime = new Date(appointment.dateTime);
        return appointment;
    }    
}

AppointmentFactory.fromMongoDocument({});