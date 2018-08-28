import * as moment from 'moment';
import * as _ from 'underscore';
import TestAddressesGenerator from './test-addresses-generator';
import TestContactsGenerator from './test-contacts-generator';

const numOfPastAppointments = 10,
    numOfTodayAppointments = 5,
    numOfFutureAppointments = 15,
    totalNumOfAppointments = numOfPastAppointments + numOfTodayAppointments + numOfFutureAppointments,
    numOfDaysFromCurrentDate = 30,
    workingDayLength = 8,
    workingDayBeginHour = 9,
    numOfMinutesInHour = 60;

class TestDateCalculator {
    private static _getRandAddOrSub = () => Math.round(Math.random() * numOfDaysFromCurrentDate);
    private static _getRandWorkingHour = () => Math.round(Math.random() * workingDayLength + workingDayBeginHour);
    private static _getRandMinutes = () => Math.round(Math.random() * numOfMinutesInHour);
    private static _clearSecondsAndMilliseconds
        = (m: moment.Moment) => m.set('second', 0).set('millisecond', 0);
    private static _setHoursAndMinutesWithinWorkingDay
        = (m: moment.Moment) => m.set('hour', TestDateCalculator._getRandWorkingHour())
                                    .set('minute', TestDateCalculator._getRandMinutes());


    public static getDateForPastAppointment(): Date {
        let m = TestDateCalculator._clearSecondsAndMilliseconds(moment());
        TestDateCalculator._setHoursAndMinutesWithinWorkingDay(m);
        return m.subtract(TestDateCalculator._getRandAddOrSub(), 'days')
            .toDate();
    }

    public static getDateForTodayAppointment(): Date {
        let m = TestDateCalculator._clearSecondsAndMilliseconds(moment());
        TestDateCalculator._setHoursAndMinutesWithinWorkingDay(m);
        return m.toDate();
    }

    public static getDateForFutureAppointment(): Date {
        let m = TestDateCalculator._clearSecondsAndMilliseconds(moment());
        TestDateCalculator._setHoursAndMinutesWithinWorkingDay(m);
        return m.add(TestDateCalculator._getRandAddOrSub(), 'days')
            .toDate();
    }
}

export default class TestAppointmentsGenerator {
    public static get TEST_APPOINTMENT_ID() {
        return 'test_appointment';
    }

    public static get NON_EXISTENT_APPOINTMENT_ID() {
        return  'appointment_not_exists';
    }

    private static _getDistinctDate(dates: Date[], dateGenFn: () => Date): Date {
        let date: Date;
        
        do {
            date = dateGenFn();
        } while (dates.map((d) => d.getTime()).indexOf(date.getTime()) >= 0);

        dates.push(date);

        return new Date(date);
    }

    private static _setDate(appointment: AppointmentsManager.IAppointment, appontmentIndex: number, dates: Date[]) {
        if (appontmentIndex < numOfPastAppointments) {
            appointment.dateTime = TestAppointmentsGenerator._getDistinctDate(
                dates, TestDateCalculator.getDateForPastAppointment
            );
        } else if (appontmentIndex >= numOfPastAppointments
            && appontmentIndex < numOfPastAppointments + numOfTodayAppointments) {
            appointment.dateTime = TestAppointmentsGenerator._getDistinctDate(
                dates, TestDateCalculator.getDateForTodayAppointment
            );
        } else {
            appointment.dateTime = TestAppointmentsGenerator._getDistinctDate(
                dates, TestDateCalculator.getDateForFutureAppointment
            );
        }
    }

    private static _getRandomContactIds(contacts: AppointmentsManager.IContact[]) {
        let numOfContacts = Math.round(Math.random() * 2 + 1);
        return (<AppointmentsManager.IContact[]>_.sample(contacts, numOfContacts))
            .map(c => c.id);
    }

    private static _getRandomAddressId = (addresses: AppointmentsManager.IAddress[]) => (<AppointmentsManager.IAddress>_.sample(addresses)).addressLine;

    public static generateGoodAppointments(opts: AppointmentsManager.TestAppointmentGeneratorOptions) {
        let appointments = <AppointmentsManager.IAppointment[]>[];
        const allDates = <Date[]>[];

        for (let i = 0; i < totalNumOfAppointments; i++) {
            let appointment = <AppointmentsManager.IAppointment>{};
            appointment.addressId = TestAppointmentsGenerator._getRandomAddressId(opts.addresses);
            appointment.contactIds = TestAppointmentsGenerator._getRandomContactIds(opts.contacts);
            TestAppointmentsGenerator._setDate(appointment, i, allDates);

            appointments.push(appointment);
        }

        appointments = _.sortBy(appointments, (a) => moment(new Date(a.dateTime)).unix());
        appointments = _.map(appointments, (a, i) => {
            a.id = `appointment${i + 1}`;
            a.title = `Title ${i + 1}`;
            a.description = `Description ${i + 1}`;
            return a;
        });

        return appointments;
    }

    public static generateGoodTestAppointment(opts: AppointmentsManager.TestAppointmentGeneratorOptions): AppointmentsManager.IAppointment {
        return {
            'id': TestAppointmentsGenerator.TEST_APPOINTMENT_ID,
            'title': 'Test title',
            'description': 'Test description',
            'dateTime': TestAppointmentsGenerator._getDistinctDate(
                opts.appointments.map((a) => a.dateTime),
                TestDateCalculator.getDateForFutureAppointment
            ),
            'addressId': _.first(opts.addresses).id,
            'contactIds': _.first(opts.contacts, 2).map((c) => c.id)
        };
    }

    public static updateAppointmentGood(opts: AppointmentsManager.TestAppointmentGeneratorOptions) {
        opts.appointmentForUpdate.title = 'New title';
        opts.appointmentForUpdate.description = 'New description';
        opts.appointmentForUpdate.dateTime = TestAppointmentsGenerator._getDistinctDate(
                                                opts.appointments.map((a) => a.dateTime)
                                                , TestDateCalculator.getDateForFutureAppointment);
        opts.appointmentForUpdate.addressId = 
            (<AppointmentsManager.IAddress>_.sample(opts.addresses)).id;
        opts.appointmentForUpdate.contactIds = [
            (<AppointmentsManager.IContact>_.sample(opts.contacts)).id
        ];
    }
}