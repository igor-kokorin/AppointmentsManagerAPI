declare namespace AppointmentsManager {
    interface IAppointment {
        id: string;
        title: string;
        description: string;
        dateTime: Date;
        addressId: string;
        contactIds: string[];
    }

    interface IAddress {
        id: string;
        title: string;
        addressLine: string;
        coordinates: {
            latitude: number;
            longtitude: number;
        }
    }

    interface IContact {
        id: string;
        firstName: string;
        lastName: string;
        middleName: string;
        company: string;
        phoneNumbers: string[];
    }

    interface TestDataBucket {
        appointments: IAppointment[];
        addresses: IAddress[];
        contacts: IContact[];
    }

    interface TestAppointmentGeneratorOptions {
        appointments?: IAppointment[];
        addresses: IAddress[];
        contacts: IContact[];
        appointmentForUpdate?: IAppointment;
    }
}