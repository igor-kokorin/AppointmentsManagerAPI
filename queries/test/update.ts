import { assert } from 'chai';
import { ObjectCreatorTesterFactory } from '../../utilities';
import { UpdateQuery, QueryBase, QueryResult, QueryResultMessages, IdCriteria } from '../index';
import { getGoodUpdateQueryOptions, StubsCollection, QueryResultChecker, UpdateQueryStubber, UpdateQueryStubChecker, getGoodInsertQueryOptions, DocumentHelper } from './helpers';
import * as _ from 'underscore';
import { SinonSpy } from 'sinon';

describe('UpdateQuery', function () {

    ObjectCreatorTesterFactory(UpdateQuery).inheritsFrom(QueryBase);
    ObjectCreatorTesterFactory(UpdateQuery, getGoodUpdateQueryOptions()).isCreatedSuccessfully();

    describe('creating UpdateQuery when', function () {
        ObjectCreatorTesterFactory(UpdateQuery, getGoodUpdateQueryOptions(), 'updateCriteria').isAbsent().isNotA(IdCriteria);
        ObjectCreatorTesterFactory(UpdateQuery, getGoodUpdateQueryOptions(), 'propsToUpdate').isAbsent().isEmpty();
    });

    describe('calling exec', function () {
        describe('if document that needs to be updated not in db', function () {
            let testContext = <{
                result: QueryResult,
                propsToUpdate: any,
                stubs: StubsCollection,
                updateStub: SinonSpy,
                errorMessage: string
            }>{
                errorMessage: QueryResultMessages.noDocsThatSatisfyGivenCriteria()
            };
            
            beforeEach(function () {
                let opts = getGoodUpdateQueryOptions();
                
                testContext.stubs = UpdateQueryStubber.whenItemWithGivenIdIsNotInDb(opts);
                testContext.updateStub = testContext.stubs.stubs.updateStub;

                let query = new UpdateQuery(opts);
                return query.exec().then((result) => {
                    testContext.result = result;
                });
            });

            afterEach(function () {
                testContext.stubs.clear();
            });

            QueryResultChecker.isFailureWithMessage(testContext);

            UpdateQueryStubChecker.checkThatItNotCallsDbSecondTime(testContext);
        });

        describe('if document that needs to be updated is valid', function () {
            let testContext = <{
                result: QueryResult,
                updatetDoc: any,
                updatedProps: any,
                updateCriteria: IdCriteria,
                stubs: StubsCollection,
                updateStub: SinonSpy
            }>{};
            
            beforeEach(function () {
                let opts = getGoodUpdateQueryOptions();
                
                let oldDoc = DocumentHelper.validDocument();
                let updatedDoc = DocumentHelper.updatedDocument();

                let stubberOpts = { dbHandle: opts.dbHandle, oldDoc };
                testContext.stubs = UpdateQueryStubber.whenPropertiesToUpdateAreValid(stubberOpts);
                testContext.updateStub = testContext.stubs.stubs.updateStub;
                testContext.updatedProps = opts.propsToUpdate;
                testContext.updatetDoc = updatedDoc;
                testContext.updateCriteria = opts.updateCriteria;

                let query = new UpdateQuery(opts);
                return query.exec().then((result) => {
                    testContext.result = result;
                });
            });

            afterEach(function () {
                testContext.stubs.clear();
            });

            QueryResultChecker.isSuccess(testContext);

            UpdateQueryStubChecker.checkThatItUsesUpdateCriteria(testContext);
            UpdateQueryStubChecker.checkThatItPassesUpdateToDb(testContext);

            it('returnes updated object', function () {
                assert.deepNestedInclude(testContext.result.data, testContext.updatetDoc);
            });
        });
        
        describe('if document that needs to be updated is invalid', function () {
            let testContext = <{
                result: QueryResult,
                stubs: StubsCollection,
                updateStub: SinonSpy
            }>{};
            
            beforeEach(function () {
                let opts = getGoodUpdateQueryOptions();
                opts.propsToUpdate = DocumentHelper.invalidProps();

                let oldDoc = DocumentHelper.validDocument();

                let stubberOpts = { dbHandle: opts.dbHandle, oldDoc };
                testContext.stubs = UpdateQueryStubber.whenPropertiesToUpdateAreInvalid(stubberOpts);
                testContext.updateStub = testContext.stubs.stubs.updateStub;

                let query = new UpdateQuery(opts);
                return query.exec().then((result) => {
                    testContext.result = result;
                });
            });

            afterEach(function () {
                testContext.stubs.clear();
            });

            QueryResultChecker.isValidationFailure(testContext);

            UpdateQueryStubChecker.checkThatItNotCallsDbSecondTime(testContext);
        });
    });
});