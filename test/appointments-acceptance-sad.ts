import { assert } from 'chai';
import validateObjAgainstSchema from '../test_helpers/validate-obj-against-schema';
import * as Promise from 'bluebird';
import TestAppointmentsGenerator from '../test_helpers/test-appointments-generator';
import { Response } from 'superagent';
import { prepareDbForTests } from '../test_helpers/common-test-utilities';
import { TestHttpClient } from '../test_helpers/test-http-client';

describe.skip('Appointments sad paths', function () {
    describe('Unauthorized request', function () {
        describe('GET against /api/appointments', function () {
            let getResponse;
            
            before(function () {
                return TestHttpClient.get({ path: '/api/appointments', authorized: false })
                    .then((response) => {
                        getResponse = response;
                    });
            });

            it('returns 401 status code', function () {
                assert.strictEqual(getResponse.status, 401);
            });

            it('response body is empty', function () {
                assert.isEmpty(getResponse.body);
            });
        });

        describe('GET against /api/appointments/:id', function () {
            let getByIdResponse;
            
            before(function () {
                return TestHttpClient.get({ path: '/api/appointments', id: 'xxx', authorized: false })
                    .then((response) => {
                        getByIdResponse = response;
                    });
            });

            it('returns 401 status code', function () {
                assert.strictEqual(getByIdResponse.status, 401);
            });
            
            it('response body is empty', function () {
                assert.isEmpty(getByIdResponse.body);
            });
        });

        describe('POST against /api/appointments', function () {
            let postResponse;
            
            before(function () {
                return TestHttpClient.post({ path: '/api/appointments', authorized: false })
                    .then((response) => {
                        postResponse = response;
                    });
            });

            it('returns 401 status code', function () {
                assert.strictEqual(postResponse.status, 401);
            });

            it('response body is empty', function () {
                assert.isEmpty(postResponse.body);
            });
        });

        describe('PUT against /api/appointments/:id', function () {
            let putResponse;
            
            before(function () {
                return TestHttpClient.put({ path: '/api/appointments', id: 'xxx', authorized: false })
                    .then((response) => {
                        putResponse = response;
                    });
            });

            it('returns 401 status code', function () {
                assert.strictEqual(putResponse.status, 401);
            });

            it('response body is empty', function () {
                assert.isEmpty(putResponse.body);
            });
        });

        describe('DELETE against /api/appointments/:id', function () {
            let deleteResponse;
            
            before(function () {
                return TestHttpClient.delete({ path: '/api/appointments', id: 'xxx', authorized: false })
                    .then((response) => {
                        deleteResponse = response;
                    });
            });

            it('returns 401 status code', function () {
                assert.strictEqual(deleteResponse.status, 401);
            });

            it('response body is empty', function () {
                assert.isEmpty(deleteResponse.body);
            });
        });
    });

    describe('Invalid request (empty body)', function () {
        describe('POST against /api/appointments', function () {
            let postResponse;

            before(function () {
                return TestHttpClient.post({ path: '/api/appointments', authorized: true })
                    .then((response) => {
                        postResponse = response;
                    });
            });

            it('returns 200 status code', function () {
                assert.strictEqual(postResponse.status, 200);
            });

            it('returns message that validates against errorMessage schema', function () {
                validateObjAgainstSchema(postResponse.body, 'errorMessage');
            });
        });

        describe('PUT against /api/appointments/:id', function () {
            let putResponse: Response;

            before(function () {
                return prepareDbForTests().then((testDataBucket) => {
                    let validAppointmentIdToUpdate = testDataBucket.appointments[0].id;
                    
                    return TestHttpClient.put({ path: '/api/appointments', id: validAppointmentIdToUpdate, authorized: false })
                        .then((response) => {
                            putResponse = response;
                        });
                });
            });

            it('returns 200 status code', function () {
                assert.strictEqual(putResponse.status, 200);
            });

            it('returns message that validates against errorMessage schema', function () {
                validateObjAgainstSchema(putResponse.body, 'errorMessage');
            });
        });
    });

    describe('Entity not found', function () {
        describe('GET against /api/appointments/:id', function () {
            let getResponse: Response;
            
            before(function () {
                return TestHttpClient.get({ path: '/api/appointments', id: TestAppointmentsGenerator.NON_EXISTENT_APPOINTMENT_ID, authorized: true })
                    .then((response) => {
                        getResponse = response;
                    });
            });

            it('returns 404 status code', function () {
                assert.strictEqual(404, getResponse.status);
            });
        });

        describe('PUT against /api/appointments/:id', function () {
            let putResponse;
            
            before(function () {
                return prepareDbForTests().then((testDataBucket) => {
                    let appointmentPutRequestBody = <AppointmentsManager.IAppointment>{};

                    TestAppointmentsGenerator.updateAppointmentGood({
                        appointmentForUpdate: appointmentPutRequestBody,
                        ...testDataBucket
                    });
                    
                    return TestHttpClient.put({ path: '/api/appointments', id: TestAppointmentsGenerator.NON_EXISTENT_APPOINTMENT_ID, body: appointmentPutRequestBody, authorized: true })
                        .then((response) => {
                            putResponse = response;
                        });
                });
            });

            it('returns 404 status code', function () {
                assert.strictEqual(404, putResponse.status);
            });
        });

        describe('DELETE against /api/appointments/:id', function () {
            let deleteResponse: Response;
            
            before(function () {
                return TestHttpClient.delete({ path: '/api/appointments', id: TestAppointmentsGenerator.NON_EXISTENT_APPOINTMENT_ID, authorized: true })
                    .then((response) => {
                        deleteResponse = response;
                    });
            });

            it('returns 404 status code', function () {
                assert.strictEqual(404, deleteResponse.status);
            });
        });
    });
});