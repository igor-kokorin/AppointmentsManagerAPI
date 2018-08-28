import { assert } from 'chai';
import { DeleteQuery, QueryResult, QueryBase, IdCriteria, QueryResultMessages } from '../index';
import { getGoodDeleteQueryOptions, StubsCollection, QueryResultChecker, DocumentHelper, DeleteQueryStubChecker } from './helpers';
import { ObjectCreatorTesterFactory } from '../../utilities';
import { SinonSpy } from 'sinon';
import { DeleteQueryStubber } from './helpers';

describe('DeleteQuery', function () {
    ObjectCreatorTesterFactory(DeleteQuery).inheritsFrom(QueryBase);
    ObjectCreatorTesterFactory(DeleteQuery, getGoodDeleteQueryOptions()).isCreatedSuccessfully();

    describe('creating DeleteQuery when', function () {
        ObjectCreatorTesterFactory(DeleteQuery, getGoodDeleteQueryOptions(), 'deleteCriteria').isAbsent().isNotA(IdCriteria);
    });

    describe('calling exec', function () {
        describe('when document with given id is in db', function () {
            let testContext = <{
                query: DeleteQuery,
                stubs: StubsCollection,
                removeStub: SinonSpy,
                result: QueryResult,
                doc: any,
                deleteCriteria: IdCriteria
            }>{};

            beforeEach(function () {
                let opts = getGoodDeleteQueryOptions();
                let doc = DocumentHelper.validDocument();

                testContext.stubs = DeleteQueryStubber.whenDocIsInDb({ ...opts, doc });
                testContext.removeStub = testContext.stubs.stubs.removeStub;
                testContext.doc = doc;
                testContext.deleteCriteria = opts.deleteCriteria;

                testContext.query = new DeleteQuery(opts);
                return testContext.query.exec().then((result) => {
                    testContext.result = result;
                });
            });

            afterEach(function () {
                testContext.stubs.clear();
            });
            
            QueryResultChecker.isSuccess(testContext);

            it(`returned result is a message === \"${QueryResultMessages.docDeletedSuccessfully()}\"`, function () {
                assert.strictEqual(testContext.result.data, QueryResultMessages.docDeletedSuccessfully());
            });

            DeleteQueryStubChecker.checkThatDbCalledWithId(testContext);
        });

        describe('when document with given id is not in db', function () {
            let testContext = <{
                result: QueryResult,
                stubs: StubsCollection,
                removeStub: SinonSpy,
                errorMessage: string
            }>{
                errorMessage: QueryResultMessages.noDocsThatSatisfyGivenCriteria()
            };

            beforeEach(function () {
                let opts = getGoodDeleteQueryOptions();

                testContext.stubs = DeleteQueryStubber.whenDocIsNotInDb(opts);
                testContext.removeStub = testContext.stubs.stubs.removeStub;

                let query = new DeleteQuery(opts);
                return query.exec().then((result) => {
                    testContext.result = result;
                });
            });

            afterEach(function () {
                testContext.stubs.clear();
            });

            QueryResultChecker.isFailureWithMessage(testContext);

            DeleteQueryStubChecker.checkThatDbNotCalledSecondTime(testContext);
        });
    });
});