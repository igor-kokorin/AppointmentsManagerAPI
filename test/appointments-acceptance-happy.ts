import { assert } from 'chai';
import validateObjAgainstSchema from '../test_helpers/validate-obj-against-schema';
import * as moment from 'moment';
import * as _ from 'underscore';
import TestAppointmentsGenerator from '../test_helpers/test-appointments-generator';
import { executeWithinMongoDb, prepareDbForTests } from '../test_helpers/common-test-utilities';
import { Response } from 'superagent';
import { TestHttpClient } from '../test_helpers/test-http-client'
import { AppointmentFactory } from '../test_helpers/appointment-test-utilities';

describe.skip('Appointments Happy Path', function () {
    this.timeout(10000);

    describe('GET against /api/appointments', function () {
        let getResponse: Response;

        before(function () {
            return prepareDbForTests().then(() => {
                return TestHttpClient.get({ path: '/api/appointments', authorized: true })
                    .then((response) => {
                        getResponse = response;
                    });
            });
        });

        it('returns 200 status code', function () {
            assert.strictEqual(getResponse.status, 200);
        });

        it('returns application/json', function () {
            assert.strictEqual(getResponse.type, 'application/json');
        });

        it('validates against appointmentCollection schema', function () {
            assert.strictEqual(validateObjAgainstSchema(getResponse.body, 'appointmentCollection'), true);
        });

        it('get only 10 appointments (paging is always on and by default pages are length 10)', function () {
            assert.strictEqual(getResponse.body.currentPageResultsCount, 10);
        });

        it('currentPageResultsCount === results.length', function () {
            assert.isTrue(getResponse.body.currentPageResultsCount === getResponse.body.results.length);
        });

        it('by default all returned appointments are from today onwards', function () {
            let currentMoment = moment();

            let isFromToday = (<AppointmentsManager.IAppointment[]>getResponse.body.results)
                .map((appointment) => moment(appointment.dateTime).diff(currentMoment, 'days') >= 0)
                .reduce((prevValue, currValue) => currValue && prevValue, true);

            assert.isTrue(isFromToday);
        });

        it('by default all returned appointments are sorted by date in ascending order', function () {
            let isInAscendingOrder = (<AppointmentsManager.IAppointment[]>getResponse.body.results)
                .map((appointment) => moment(appointment.dateTime).unix())
                .reduce((prevValue, currValue) => currValue - prevValue, 0);

            assert.isTrue(isInAscendingOrder >= 0);
        });
    });

    describe('GET against /api/appointments/:id', function () {
        let appointmentId
            , getByIdResponse: Response;

        before(function () {
            return prepareDbForTests().then((testDataBucket) => {
                appointmentId = _.first(testDataBucket.appointments).id;

                return TestHttpClient.get({ path: '/api/appointments', id: appointmentId, authorized: true })
                    .then((response) => {
                        getByIdResponse = response;
                    });
            });
        });

        it('returns 200 status code', function () {
            assert.strictEqual(getByIdResponse.status, 200);
        });

        it('returns application/json', function () {
            assert.strictEqual(getByIdResponse.type, 'application/json');
        });

        it('returns response that validate against appointment schema', function () {
            assert.isTrue(validateObjAgainstSchema(getByIdResponse.body, 'appointment'));
        });

        it('returns response with id === :id', function () {
            assert.strictEqual(getByIdResponse.body.result.id, appointmentId);
        });
    });

    describe('POST against /api/appointments', function() {
        let postResponse: Response
            , newAppointment;

        before(function () {
            this.timeout(10000);
            
            return prepareDbForTests().then((testDataBucket) => {
                newAppointment = TestAppointmentsGenerator
                                    .generateGoodTestAppointment(testDataBucket);

                return TestHttpClient.post({ path: '/api/appointments', body: newAppointment, authorized: true })
                    .then((response) => {
                        postResponse = response;
                    });
            });
        });

        it('returns 201 status code', function () {
            assert.strictEqual(postResponse.status, 201);
        });

        it('returns application/json', function () {
            assert.strictEqual(postResponse.type, 'application/json');
        });

        it('return new appointment with id set', function () {
            assert.strictEqual(postResponse.body.result.id, TestAppointmentsGenerator.TEST_APPOINTMENT_ID);
        });

        it('returns new appointment that validate against appointment schema', function () {
            assert.isTrue(validateObjAgainstSchema(postResponse.body, 'appointment'));
        });

        it('response includes Location header that points to created appointment', function () {
            assert.strictEqual(postResponse.get('Location'), `/api/appointments/${postResponse.body.result.id}`)
        });
        
        it('returned appointment === posted appointment', function () {
            assert.deepInclude(AppointmentFactory.fromResponse(postResponse), newAppointment);
        });

        it('insert new appointment into database', function () {
            return executeWithinMongoDb((db) => {
                return db
                    .collection('appointments')
                    .findOne({ _id: TestAppointmentsGenerator.TEST_APPOINTMENT_ID })
                    .then((appointmentDoc) => {
                        assert.strictEqual(appointmentDoc._id, TestAppointmentsGenerator.TEST_APPOINTMENT_ID);
                    });
            });
        });

        it('can get posted appointment from /api/appointments/:id', function () {
            return TestHttpClient.get({path: '/api/appointments', id: newAppointment.id, authorized: true })
                .then((response) => {
                    assert.strictEqual(response.body.result.id, TestAppointmentsGenerator.TEST_APPOINTMENT_ID); 
                });
        });
    });

    describe('PUT against /api/appointments/:id', function () {
        let updatedAppointment: AppointmentsManager.IAppointment
            , putResponse: Response;
        
        before(function () {
            return prepareDbForTests().then((testDataBucket) => {
                updatedAppointment = _.first(testDataBucket.appointments);
                TestAppointmentsGenerator.updateAppointmentGood({
                    ...testDataBucket,
                    appointmentForUpdate: updatedAppointment
                });
                
                return TestHttpClient.put({ path: '/api/appointments', id: updatedAppointment.id, body: updatedAppointment, authorized: true })
                    .then((response) => {
                        putResponse = response;
                    });
            });
        });

        it('returns 200 status code', function () {
            assert.strictEqual(putResponse.status, 200);
        });

        it('returns application/json', function () {
            assert.strictEqual(putResponse.type, 'application/json');
        });

        it('returned response validates against appointment schema', function () {
            assert.isTrue(validateObjAgainstSchema(putResponse.body, 'appointment'))
        });

        it('returned appointment === updatedAppointment', function () {
            assert.deepInclude(AppointmentFactory.fromResponse(putResponse), updatedAppointment);
        });

        it('can get updated appointment from database', function () {
            return executeWithinMongoDb((db) => {
                return db
                    .collection('appointments')
                    .findOne({ _id: updatedAppointment.id })
                    .then((appointmentDoc) => {
                        assert.deepInclude(AppointmentFactory.fromMongoDocument(appointmentDoc), updatedAppointment);
                    });;
            });
        });

        it('can get updated appointment from /api/appointments/:id', function () {
            return TestHttpClient.get({ path: '/api/appointments', id: putResponse.body.result.id, authorized: true })
                .then((response) => {
                    assert.deepInclude(response.body, putResponse.body);
                });
        });
    });

    describe('DELETE against /api/appointments/:id', function () {
        let deletedAppointment
            , deleteResponse;

        before(function () {
            this.timeout(10000);
            
            return prepareDbForTests().then((testDataBucket) => {
                deletedAppointment = _.first(testDataBucket.appointments);

                return TestHttpClient.delete({ path: '/api/appointments', id: deletedAppointment.id, authorized: true })
                    .then((response) => {
                        deleteResponse = response;
                    });
            });
        });

        it('return 204 status code', function () {
            assert.strictEqual(deleteResponse.status, 204);
        });

        it('does not include body', function () {
            assert.isEmpty(deleteResponse.body);
        });

        it('remove appointment with :id from database', function () {
            return executeWithinMongoDb(function (db) {
                return db
                    .collection('appointments')
                    .findOne({ '_id': deletedAppointment.id })
                    .then((result) => {
                        assert.isNull(result);
                    });
            })
        });

        it('can not get deleted appointment from /api/appointments/:id', function () {
            return TestHttpClient.get({ path: '/api/appointments', id: deletedAppointment.id, authorized: true })
                .then((response) => {
                    assert.strictEqual(response.status, 404);
                });
        });
    });
});