import { assert } from 'chai';
import { GetOneQuery, QueryBase, QueryResult, GetOneQueryExecuteOptions, QueryResultMessages } from '../index';
import { QueryOptionsGenerator, QueryResultChecker } from './helpers';
import { ObjectInstantiationTesterFactory, MethodCallTesterFactory } from '../../utilities';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';

describe('GetOneQuery', function () {
    ObjectInstantiationTesterFactory
        .forInheritanceTest(GetOneQuery)
        .inheritsFrom(QueryBase);

    ObjectInstantiationTesterFactory
        .forInstantiationTest(GetOneQuery, QueryOptionsGenerator.forGetOneQueryConstructor())
        .isCreatedSuccessfully();

    describe('calling execute', function () {
        describe('sad path', function () {
            MethodCallTesterFactory({
                methodName: 'execute',
                obj: new GetOneQuery(QueryOptionsGenerator.forGetOneQueryConstructor()),
                optName: 'criteria',
                opts: QueryOptionsGenerator.forGetOneQuery_execute()
            }).isAbsent();
        });

        describe('happy path', function () {
            describe('when there is an element in data store that satisfy given criteria', function () {
                let findOneStub: SinonStub;
                let queryResult: QueryResult;
                let dataStoreResult: any;
                let executeOpts: GetOneQueryExecuteOptions;
    
                beforeEach(function () {
                    let opts = QueryOptionsGenerator.forGetOneQueryConstructor();
    
                    dataStoreResult = 'find_one_query_result';
                    findOneStub = sinon.stub(opts.dataSource, 'findOne').returns(Promise.resolve(dataStoreResult));
                    
                    let query = new GetOneQuery(opts);
                    executeOpts = QueryOptionsGenerator.forGetOneQuery_execute();
                    return query.execute(executeOpts).then((result) => {
                        queryResult = result;
                    });
                });
    
                afterEach(function () {
                    findOneStub.restore();
                });
        
                it('executes successfully', function () {
                    QueryResultChecker.isSuccess(queryResult);
                });
    
                it('returns data from data store', function () {
                    assert.strictEqual(queryResult.data, dataStoreResult);
                });
    
                it('criteria is passed to data store', function () {
                    assert.strictEqual(findOneStub.args[0][0].criteria, executeOpts.criteria);
                });
            });
    
            describe('when there is no elements in data store that satisfy given criteria', function () {
                let findOneStub: SinonStub;
                let queryResult: QueryResult;
    
                beforeEach(function () {
                    let opts = QueryOptionsGenerator.forGetOneQueryConstructor();
    
                    findOneStub = sinon.stub(opts.dataSource, 'findOne').returns(Promise.resolve(null));
                    
                    let query = new GetOneQuery(opts);
                    let executeOpts = QueryOptionsGenerator.forGetOneQuery_execute();
                    return query.execute(executeOpts).then((result) => {
                        queryResult = result;
                    });
                });
    
                afterEach(function () {
                    findOneStub.restore();
                });
        
                it('executes unsuccessfully', function () {
                    QueryResultChecker.isFailure(queryResult, QueryResultMessages.noEntityThatSatisfyGivenCriteria());
                });
            });
        });
    });
});