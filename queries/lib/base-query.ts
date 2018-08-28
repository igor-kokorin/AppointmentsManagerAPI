import { PropertyCheckerFactory } from '../../utilities';
import { Model, Document } from 'mongoose';
import { QueryResult } from './query-result';
import { UserInfo } from '../../identity';
import { DataSource } from '../../data_source';

export interface CommonQueryOptions {
    dataSource: DataSource;
}

export abstract class QueryBase {
    public dataSource: DataSource;

    constructor(opts: CommonQueryOptions) {
        PropertyCheckerFactory(opts, 'dataSource').isPresent();

        this.dataSource = opts.dataSource;
    }

    public abstract execute(...args): Promise<QueryResult>;
}