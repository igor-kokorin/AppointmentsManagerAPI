import { assert } from 'chai';
import { InsertQuery, QueryBase, QueryResult } from '../index';
import { getGoodInsertQueryOptions, StubsCollection, QueryResultChecker, DocumentHelper } from './helpers';
import { ObjectCreatorTesterFactory } from '../../utilities';
import { InsertQueryStubber, InsertQueryStubChecker } from './helpers';
import { SinonSpy } from 'sinon';

describe('InsertQuery', function () {
    ObjectCreatorTesterFactory(InsertQuery).inheritsFrom(QueryBase);
    ObjectCreatorTesterFactory(InsertQuery, getGoodInsertQueryOptions()).isCreatedSuccessfully();

    describe('creating InsertQuery when', function () {
        ObjectCreatorTesterFactory(InsertQuery, getGoodInsertQueryOptions(), 'docToInsert').isAbsent().isEmpty();
    });

    describe('calling exec', function () {
        describe('if inserted document is valid', function () {
            let testContext = <{
                result: QueryResult,
                docToInsert: any,
                stubs: StubsCollection,
                insertStub: SinonSpy
            }>{};
            
            beforeEach(function () {
                let opts = getGoodInsertQueryOptions();

                testContext.stubs = InsertQueryStubber.whenDocToInsertIsValid(opts);
                testContext.insertStub = testContext.stubs.stubs.insertStub;
                testContext.docToInsert = opts.docToInsert;
                
                let query = new InsertQuery(opts);
                return query.exec().then((result) => {
                    testContext.result = result;
                });
            });

            afterEach(function () {
                testContext.stubs.clear();
            });

            QueryResultChecker.isSuccess(testContext);

            InsertQueryStubChecker.checkThatItPassesObjToDb(testContext);

            it('returns document with identifier', function () {
                assert.isDefined(testContext.result.data._id);
            });
        });

        describe('if inserted document has extra properties that not in the model', function () {
            let testContext = <{
                result: QueryResult,
                stubs: StubsCollection,
                insertStub: SinonSpy,
                docToInsert: any,
                notInModelPropertyName: string
            }>{};

            before(function () {
                const PROPERTY_THAT_NOT_IN_THE_MODEL = 'notInTheModel';

                let opts = getGoodInsertQueryOptions();
                opts.docToInsert[PROPERTY_THAT_NOT_IN_THE_MODEL] = 'property';
                
                let stubberOpts = {
                    dbHandle: opts.dbHandle,
                    docToInsert: opts.docToInsert,
                    notInModelPropertyName: PROPERTY_THAT_NOT_IN_THE_MODEL
                };
                testContext.stubs = InsertQueryStubber.whenObjectHasExtraPropertiesNotInTheModel(stubberOpts);
                testContext.insertStub = testContext.stubs.stubs.insertStub;
                testContext.docToInsert = opts.docToInsert;
                testContext.notInModelPropertyName = PROPERTY_THAT_NOT_IN_THE_MODEL;

                let query = new InsertQuery(opts);
                return query.exec().then((result) => {
                    testContext.result = result;
                });
            });

            afterEach(function () {
                testContext.stubs.clear();
            });

            QueryResultChecker.isSuccess(testContext);

            InsertQueryStubChecker.checkThatPropertyNotInTheModelIsIgnored(testContext);

            it('returns document with identifier', function () {
                assert.isDefined(testContext.result.data._id);
            });
        });
        
        describe('if inserted document is invalid', function () {
            let testContext = <{
                result: QueryResult,
                stubs: StubsCollection,
                insertStub: SinonSpy
            }>{};
            
            beforeEach(function () {
                let opts = getGoodInsertQueryOptions();
                opts.docToInsert = DocumentHelper.invalidDocument();

                testContext.stubs = InsertQueryStubber.whenDocToInsertIsNotValid(opts);
                testContext.insertStub = testContext.stubs.stubs.insertStub;

                let query = new InsertQuery(opts);
                return query.exec().then((result) => {
                    testContext.result = result;
                });
            });

            afterEach(function () {
                testContext.stubs.clear();
            });

            QueryResultChecker.isValidationFailure(testContext);

            InsertQueryStubChecker.checkThatItNotCallsDb(testContext);
        });
    });
});
