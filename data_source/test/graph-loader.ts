import { ObjectInstantiationTesterFactory, MethodCallTesterFactory } from '../../utilities';
import { GraphLoader } from '../index';
import { DataSourceOptionsGenerator, DataSourceHelper } from './helpers';
import * as sinon from 'sinon';
import { AssertionError } from 'assert';
import { GraphLoaderQueryLoadOptions } from '../lib/graph-loader-query';
import { assert } from 'chai';

describe('GraphLoader', function () {
    ObjectInstantiationTesterFactory
        .forInstantiationTest(GraphLoader, DataSourceOptionsGenerator.forGraphLoaderConstructor())
        .isCreatedSuccessfully();

    describe('creating GraphLoader when', function () {
        ObjectInstantiationTesterFactory
            .forOptionsPropertyTest(GraphLoader, DataSourceOptionsGenerator.forGraphLoaderConstructor(), 'graphLoaderQuery')
            .isAbsent();
    });

    describe('calling load', function () {
        describe('sad path', function () {
            MethodCallTesterFactory({
                methodName: 'load',
                obj: new GraphLoader(DataSourceOptionsGenerator.forGraphLoaderConstructor()),
                optName: 'userId',
                opts: DataSourceOptionsGenerator.forGraphLoaderQuery_load()
            }).isAbsent();

            MethodCallTesterFactory({
                methodName: 'load',
                obj: new GraphLoader(DataSourceOptionsGenerator.forGraphLoaderConstructor()),
                optName: 'dataItems',
                opts: DataSourceOptionsGenerator.forGraphLoaderQuery_load()
            }).isAbsent().isNotA(Array).isEmpty();

            MethodCallTesterFactory({
                methodName: 'load',
                obj: new GraphLoader(DataSourceOptionsGenerator.forGraphLoaderConstructor()),
                optName: 'relations',
                opts: DataSourceOptionsGenerator.forGraphLoaderQuery_load()
            }).isAbsent().isNotA(Array).isEmpty();
        });

        describe('happy path', function () {
            let graphLoaderQueryResult = 'graph';

            let dataSourceHelper = new DataSourceHelper(GraphLoader, 'graphLoaderQuery');
            dataSourceHelper.executeQuery('load', graphLoaderQueryResult);
            
            it('returns number that is returned from DataSourceQueries.count', function () {
                assert.strictEqual(dataSourceHelper.queryResult, graphLoaderQueryResult);
            });
        });
    });
});