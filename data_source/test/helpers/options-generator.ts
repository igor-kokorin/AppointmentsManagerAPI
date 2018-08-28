import { DataSourceOptions, DataSourceQueries, CountOptions, FindOptions, FindOneOptions, InsertOneOptions, UpdateOneOptions, RemoveOneOptions, GraphLoaderOptions } from '../../index';
import { GraphLoaderQuery, GraphLoaderQueryLoadOptions } from '../../lib/graph-loader-query';

export class DataSourceOptionsGenerator {
    public static forDataSourceConstructor(): DataSourceOptions {
        return {
            dataSourceQueries: <DataSourceQueries>{
                count: new Function(),
                find: new Function(),
                findOne: new Function(),
                insertOne: new Function(),
                removeOne: new Function(),
                updateOne: new Function()
            }
        };
    }
    
    public static forDataSourceQuery_count(): CountOptions {
        return { criteria: 'count_criteria' };
    }

    public static forDataSourceQuery_find(): FindOptions {
        return { criteria: 'find_criteria', skip: 4, take: 12, sortOptions: 'sort' };
    }
    
    public static forDataSourceQuery_findOne(): FindOneOptions {
        return { criteria: 'findOne_criteria' };
    }

    public static forDataSourceQuery_insertOne(): InsertOneOptions {
        return { propsToInsert: { prop1: 'prop1', prop2: 'prop2' } };
    }

    public static forDataSourceQuery_updateOne(): UpdateOneOptions {
        return { criteria: 'update_criteria', propsToUpdate: { prop1: 'prop1', prop2: 'prop2' } };
    }

    public static forDataSourceQuery_removeOne(): RemoveOneOptions {
        return { criteria: 'remove_criteria' };
    }

    public static forGraphLoaderConstructor(): GraphLoaderOptions {
        return {
            graphLoaderQuery: <GraphLoaderQuery>{ load: new Function() }
        };
    }

    public static forGraphLoaderQuery_load(): GraphLoaderQueryLoadOptions {
        return {
            dataItems: [ 'item1', 'item2', 'item3' ],
            relations: [ 'relation1', 'relation2' ]
        };
    }
}