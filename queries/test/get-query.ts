import { ObjectInstantiationTesterFactory, MethodCallTesterFactory } from '../../utilities';
import { QueryBase, GetQuery, GetQueryOptions, QueryResult, QueryResultMessages, GetQueryExecuteOptions } from '../index';
import { Page } from '../../pager';
import { assert } from 'chai';
import { QueryResultChecker, QueryOptionsGenerator } from './helpers';
import * as sinon from 'sinon';
import { SinonSpy, SinonStub } from 'sinon';
import { FindOptions } from '../../data_source';

describe('GetQuery', function () {
    ObjectInstantiationTesterFactory
        .forInheritanceTest(GetQuery)
        .inheritsFrom(QueryBase);

    ObjectInstantiationTesterFactory
        .forInstantiationTest(GetQuery, QueryOptionsGenerator.forGetQueryConstructor())
        .isCreatedSuccessfully();

    describe('calling execute', function () {
        describe('sad path', function () {
            MethodCallTesterFactory({
                methodName: 'execute',
                obj: new GetQuery(QueryOptionsGenerator.forGetQueryConstructor()),
                optName: 'page',
                opts: QueryOptionsGenerator.forGetQuery_execute()
            }).isAbsent().isNotA(Page);
            
            MethodCallTesterFactory({
                methodName: 'execute',
                obj: new GetQuery(QueryOptionsGenerator.forGetQueryConstructor()),
                optName: 'criteria',
                opts: QueryOptionsGenerator.forGetQuery_execute()
            }).isAbsent();
            
            MethodCallTesterFactory({
                methodName: 'execute',
                obj: new GetQuery(QueryOptionsGenerator.forGetQueryConstructor()),
                optName: 'sortOptions',
                opts: QueryOptionsGenerator.forGetQuery_execute()
            }).isAbsent();
        });

        describe('happy path', function () {
            describe('when there is no elements in data store that satisfy given criteria', function () {
                let queryResult: QueryResult;
                let countStub: SinonStub;
                let findSpy: SinonSpy;
                let executeOpts: GetQueryExecuteOptions;
    
                beforeEach(function () {
                    let opts = QueryOptionsGenerator.forGetQueryConstructor();
                    let query = new GetQuery(opts);
    
                    countStub = sinon.stub(opts.dataSource, 'count').returns(Promise.resolve(0));
                    findSpy = sinon.spy(opts.dataSource, 'find');
    
                    executeOpts = QueryOptionsGenerator.forGetQuery_execute();
                    
                    return query.execute(executeOpts).then((result) => {
                        queryResult = result;
                    });
                });
    
                afterEach(function () {
                    countStub.restore();
                    findSpy.restore();
                });
    
                it('executes unsuccessfully', function () {
                    QueryResultChecker.isFailure(queryResult, QueryResultMessages.noEntitiesThatSatisfyGivenCriteria());
                });

                it('passes to DataSource.count criteria', function () {
                    assert.strictEqual(countStub.args[0][0].criteria, executeOpts.criteria);
                });

                it('does not send query to data store second time', function () {
                    assert.isTrue(findSpy.notCalled);
                });
            });

            describe('when there are elements that satisfy given criteria', function () {
                describe('and page falls within results range', function () {
                    describe('and there are enough elements to satisfy given page size', function () {
                        const pageNumber = 3;
                        const pageSize = 150;
                        
                        let findMethodResult: any;
                        let queryResult: QueryResult;
                        let countStub: SinonStub;
                        let findStub: SinonStub;

                        let executeOpts: GetQueryExecuteOptions;

                        beforeEach(function () {
                            const numOfEntitiesThatSatisfyCriteria = 1000;

                            let opts = QueryOptionsGenerator.forGetQueryConstructor();
                            
                            countStub = sinon.stub(opts.dataSource, 'count')
                                .returns(Promise.resolve(numOfEntitiesThatSatisfyCriteria));
                            
                            findMethodResult = 'find_query_result';
                            findStub = sinon.stub(opts.dataSource, 'find')
                                .returns(Promise.resolve(findMethodResult));

                            executeOpts = QueryOptionsGenerator.forGetQuery_execute();
                            executeOpts.page = new Page({ pageNumber, pageSize });
                            
                            let query = new GetQuery(opts);

                            return query.execute(executeOpts).then((result) => {
                                queryResult = result;
                            });
                        });

                        afterEach(function () {
                            countStub.restore();
                            findStub.restore();
                        });

                        it('passes to DataSource.count criteria', function () {
                            assert.strictEqual(countStub.args[0][0].criteria, executeOpts.criteria);
                        });

                        it('executes successfully', function () {
                            QueryResultChecker.isSuccess(queryResult);
                        });

                        it('returns data that is returned from DataSource.find', function () {
                            assert.strictEqual(queryResult.data, findMethodResult);
                        });

                        it('passes to DataSource.find method proper options', function () {
                            let take = pageSize;
                            let skip = (pageNumber - 1) * pageSize;

                            assert.strictEqual(findStub.args[0][0].criteria, executeOpts.criteria, 'criteria must be passed to DataSource.find');
                            assert.strictEqual(findStub.args[0][0].sortOptions, executeOpts.sortOptions, 'sort options must be passed to DataSource.find');
                            assert.strictEqual(findStub.args[0][0].skip, skip, 'passed to DataSource.find skip option must be equal to ((page number - 1) * page size)');
                            assert.strictEqual(findStub.args[0][0].take, take, 'passed to DataSource.find take option must be equal to page size');
                        });
                    });

                    describe('and there are not enough elements to satisfy given page size', function () {
                        const pageNumber = 2;
                        const pageSize = 150;
                        const numOfEntitiesThatSatisfyCriteria = 200;
                        
                        let findMethodResult: any;
                        let queryResult: QueryResult;
                        let countStub: SinonStub;
                        let findStub: SinonStub;

                        let executeOpts: GetQueryExecuteOptions;

                        beforeEach(function () {
                            let opts = QueryOptionsGenerator.forGetQueryConstructor();
                            
                            countStub = sinon.stub(opts.dataSource, 'count')
                                .returns(Promise.resolve(numOfEntitiesThatSatisfyCriteria));
                            
                            findMethodResult = 'find_query_result';
                            findStub = sinon.stub(opts.dataSource, 'find')
                                .returns(Promise.resolve(findMethodResult));

                            executeOpts = QueryOptionsGenerator.forGetQuery_execute();
                            executeOpts.page = new Page({ pageNumber, pageSize });
                            
                            let query = new GetQuery(opts);

                            return query.execute(executeOpts).then((result) => {
                                queryResult = result;
                            });
                        });

                        afterEach(function () {
                            countStub.restore();
                            findStub.restore();
                        });

                        it('passes to DataSource.count criteria', function () {
                            assert.strictEqual(countStub.args[0][0].criteria, executeOpts.criteria);
                        });

                        it('executes successfully', function () {
                            QueryResultChecker.isSuccess(queryResult);
                        });

                        it('returns data that is returned from DataSource.find', function () {
                            assert.strictEqual(queryResult.data, findMethodResult);
                        });

                        it('passes to DataSource.find method proper options', function () {
                            let take = numOfEntitiesThatSatisfyCriteria - (pageNumber - 1) * pageSize;
                            let skip = (pageNumber - 1) * pageSize;

                            assert.strictEqual(findStub.args[0][0].criteria, executeOpts.criteria, 'criteria must be passed to DataSource.find');
                            assert.strictEqual(findStub.args[0][0].sortOptions, executeOpts.sortOptions, 'sort options must be passed to DataSource.find');
                            assert.strictEqual(findStub.args[0][0].skip, skip, 'passed to DataSource.find skip option must be equal to ((page number - 1) * page size)');
                            assert.strictEqual(findStub.args[0][0].take, take, 'passed to DataSource.find take option must be equal to number of entities that can be returned');
                        });
                    });
                });

                describe('and page falls out of results range', function () {
                    const pageNumber = 8;
                    const pageSize = 150;
                    const numOfEntitiesThatSatisfyCriteria = 200;
                    
                    let queryResult: QueryResult;
                    let countStub: SinonStub;
                    let findSpy: SinonSpy;

                    let executeOpts: GetQueryExecuteOptions;

                    beforeEach(function () {
                        let opts = QueryOptionsGenerator.forGetQueryConstructor();
                        
                        countStub = sinon.stub(opts.dataSource, 'count')
                            .returns(Promise.resolve(numOfEntitiesThatSatisfyCriteria));
                        
                        findSpy = sinon.spy(opts.dataSource, 'find');

                        executeOpts = QueryOptionsGenerator.forGetQuery_execute();
                        executeOpts.page = new Page({ pageNumber, pageSize });
                        
                        let query = new GetQuery(opts);

                        return query.execute(executeOpts).then((result) => {
                            queryResult = result;
                        });
                    });

                    afterEach(function () {
                        countStub.restore();
                        findSpy.restore();
                    });

                    it('executes unsuccessfully', function () {
                        QueryResultChecker.isFailure(queryResult, QueryResultMessages.pageOutOfResultsRange());
                    });

                    it('passes to DataSource.count criteria', function () {
                        assert.strictEqual(countStub.args[0][0].criteria, executeOpts.criteria);
                    });

                    it('does not send query to data store second time', function () {
                        assert.isTrue(findSpy.notCalled);
                    });
                });
            });
        });
    });
});