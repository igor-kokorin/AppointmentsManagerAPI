import { CommonQueryOptions, GetQueryOptions, GetQueryExecuteOptions, GetOneQueryOptions, GetOneQueryExecuteOptions } from '../../index';
import { Page } from '../../../pager';
import { DataSourceQueries, DataSource } from '../../../data_source';

export class QueryOptionsGenerator {
    public static forQueryBaseConstructor(): CommonQueryOptions {
        return {
            dataSource: <DataSource>{
                count: new Function(),
                find: new Function(),
                findOne: new Function(),
                insertOne: new Function(),
                removeOne: new Function(),

                dataSourceQueries: <DataSourceQueries>{}
            }
        };
    }

    public static forGetQueryConstructor(): GetQueryOptions {
        return QueryOptionsGenerator.forQueryBaseConstructor();
    }

    public static forGetQuery_execute(): GetQueryExecuteOptions {
        return {
            criteria: 'get_criteria',
            page: new Page({ pageNumber: 3, pageSize: 56 }),
            sortOptions: 'get_sort_options'
        };
    }

    public static forGetOneQueryConstructor(): GetOneQueryOptions {
        return QueryOptionsGenerator.forQueryBaseConstructor();
    }

    public static forGetOneQuery_execute(): GetOneQueryExecuteOptions {
        return {
            criteria: 'get_one_criteria'
        };
    }
/*
    public static forInsertQuery(): InsertQueryOptions {
        return <InsertQueryOptions>{};
    }
    
    public static forFindByIdQuery(): FindOneQueryOptions {
        return <FindOneQueryOptions>{};
    }
    
    public static forUpdateQuery(): UpdateQueryOptions {
        return <UpdateQueryOptions>{};
    }
    
    public static forDeleteQuery(): DeleteQueryOptions {
        return <DeleteQueryOptions>{};
    }
*/
}