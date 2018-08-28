import { ObjectInstantiationTesterFactory, MethodCallTesterFactory } from '../../utilities';
import { DataSource, CountOptions, FindOneOptions, FindOptions, InsertOneOptions, UpdateOneOptions } from '../index';
import { DataSourceOptionsGenerator, DataSourceHelper } from './helpers';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import * as _ from 'underscore';
import * as Promise from 'bluebird';

function setUpMethodTesterFactoryForDataSource(queryMethodName: string, queryMethodOptName: string) {
    let dataSourceOpts = DataSourceOptionsGenerator.forDataSourceConstructor();
    let dataSource = new DataSource(dataSourceOpts);

    let queryOpts = DataSourceOptionsGenerator['forDataSourceQuery_' + queryMethodName](dataSourceOpts);

    return MethodCallTesterFactory({
        obj: dataSource,
        opts: queryOpts,
        optName: queryMethodOptName,
        methodName: queryMethodName
    });
}

describe('DataSource', function () {
    ObjectInstantiationTesterFactory
        .forInstantiationTest(DataSource, DataSourceOptionsGenerator.forDataSourceConstructor())
        .isCreatedSuccessfully();

    describe('creating DataSource when', function () {
        ObjectInstantiationTesterFactory
            .forOptionsPropertyTest(DataSource, DataSourceOptionsGenerator.forDataSourceConstructor(), 'dataSourceQueries')
            .isAbsent();
    });

    describe('testing queries', function () {
        describe('calling count', function () {
            describe('sad path', function () {
                setUpMethodTesterFactoryForDataSource('count', 'criteria')
                    .isAbsent();
            });
    
            describe('happy path', function () {
                const numOfItemsThatSatisfyCriteria = 45;
                
                let dataSourceHelper = new DataSourceHelper(DataSource, 'dataSourceQueries');
                dataSourceHelper.executeQuery('count', numOfItemsThatSatisfyCriteria);
                
                it('returns number that is returned from DataSourceQueries.count', function () {
                    assert.strictEqual(dataSourceHelper.queryResult, numOfItemsThatSatisfyCriteria);
                });
            });
        });
    
        describe('calling find', function () {
            describe('sad path', function () {
                setUpMethodTesterFactoryForDataSource('find', 'criteria')
                    .isAbsent();
    
                setUpMethodTesterFactoryForDataSource('find', 'skip')
                    .isNotAnInteger().isNotGtThanOrEqTo(0);
    
                setUpMethodTesterFactoryForDataSource('find', 'take')
                    .isNotAnInteger().isNotGtThanOrEqTo(0);
            });
    
            describe('happy path', function () {
                let dataStoreItems = [ 'item1', 'item2', 'item3' ];
        
                let dataSourceHelper = new DataSourceHelper(DataSource, 'dataSourceQueries');
                dataSourceHelper.executeQuery('find', dataStoreItems);

                it('returns array that is returned from DataSourceQueries.find', function () {
                    assert.isArray(dataSourceHelper.queryResult, 'query result must be an array');
                    assert.deepEqual(dataSourceHelper.queryResult, dataStoreItems, 'query result data must be equal DataSourceQueries.find result');
                });
            });
        });

        describe('calling findOne', function () {
            describe('sad path', function () {
                setUpMethodTesterFactoryForDataSource('findOne', 'criteria')
                    .isAbsent();
            });
    
            describe('happy path', function () {
                let dataStoreItem = 'item';
        
                let dataSourceHelper = new DataSourceHelper(DataSource, 'dataSourceQueries');
                dataSourceHelper.executeQuery('findOne', dataStoreItem);
        
                it('returns single item that is returned from DataSourceQueries.findOne', function () {
                    assert.isNotArray(dataSourceHelper.queryResult, 'query result must be a single item');
                    assert.strictEqual(dataSourceHelper.queryResult, dataStoreItem, 'query result data must be equal DataSourceQueries.findOne result');
                });
            });
        });

        describe('calling insertOne', function () {
            describe('sad path', function () {
                setUpMethodTesterFactoryForDataSource('insertOne', 'propsToInsert')
                    .isAbsent().isNotAnObject().isEmpty();
            });
    
            describe('happy path', function () {
                let insertedDataStoreItem = 'inserted_item';
        
                let dataSourceHelper = new DataSourceHelper(DataSource, 'dataSourceQueries');
                dataSourceHelper.executeQuery('insertOne', insertedDataStoreItem);
        
                it('returns single item that is returned from DataSourceQueries.insertOne', function () {
                    assert.isNotArray(dataSourceHelper.queryResult, 'query result must be a single item');
                    assert.strictEqual(dataSourceHelper.queryResult, insertedDataStoreItem, 'query result data must be equal DataSourceQueries.insertOne result');
                });
            });
        });

        describe('calling updateOne', function () {
            describe('sad path', function () {
                setUpMethodTesterFactoryForDataSource('updateOne', 'criteria')
                    .isAbsent();
    
                setUpMethodTesterFactoryForDataSource('updateOne', 'propsToUpdate')
                    .isAbsent().isNotAnObject().isEmpty();
            });
    
            describe('happy path', function () {
                let updatedDataStoreItem = 'updated_item';
    
                let dataSourceHelper = new DataSourceHelper(DataSource, 'dataSourceQueries');
                dataSourceHelper.executeQuery('updateOne', updatedDataStoreItem);

                it('returns single item that is returned from DataSourceQueries.updateOne', function () {
                    assert.isNotArray(dataSourceHelper.queryResult, 'query result must be a single item');
                    assert.strictEqual(dataSourceHelper.queryResult, updatedDataStoreItem, 'query result data must be equal DataSourceQueries.insertOne result');
                });
            });
        });
        
        describe('calling removeOne', function () {
            describe('sad path', function () {
                setUpMethodTesterFactoryForDataSource('removeOne', 'criteria')
                    .isAbsent();
            });
    
            describe('happy path', function () {
                let removedDataStoreItem = 'removed_item';
    
                let dataSourceHelper = new DataSourceHelper(DataSource, 'dataSourceQueries');
                dataSourceHelper.executeQuery('updateOne', removedDataStoreItem);

                it('returns single item that is returned from DataSourceQueries.updateOne', function () {
                    assert.isNotArray(dataSourceHelper.queryResult, 'query result must be a single item');
                    assert.strictEqual(dataSourceHelper.queryResult, removedDataStoreItem, 'query result data must be equal DataSourceQueries.insertOne result');
                });
            });
        });
    });
});