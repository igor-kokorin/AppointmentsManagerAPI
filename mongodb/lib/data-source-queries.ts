import { Page } from '../../pager';
import { model, Model, Document, DocumentQuery } from 'mongoose';
import { DataSource, FindOneOptions, FindOptions, CountOptions, InsertOneOptions, UpdateOneOptions, RemoveOneOptions } from '../../data_source';
import { PropertyCheckerFactory } from '../../utilities';
import { MongoDbHelper } from '../index';
import * as _ from 'underscore';
import { DataSourceQueries } from '../../data_source';

export interface MongoDbDataSourceQueriesOptions {
    model: Model<Document>;
}

export class MongoDbDataSourceQueries implements DataSourceQueries {
    public model: Model<Document>;

    constructor(opts: MongoDbDataSourceQueriesOptions) {
        PropertyCheckerFactory(opts, 'model').isPresent();

        opts.model.schema.set('validateBeforeSave', false);

        this.model = opts.model;
    }

    public count(opts: CountOptions): Promise<number> {
        return this.model.count(opts.criteria).exec();
    }

    public find(opts: FindOptions): Promise<any[]> {
        let query = this.model.find(opts.criteria);

        if (opts.take) {
            query.limit(opts.take);
        }

        if (opts.skip) {
            query.skip(opts.skip);
        }

        if (opts.sortOptions) {
            query.sort(opts.sortOptions);
        }
        
        return query.exec();
    }

    public findOne(opts: FindOneOptions): Promise<any> {
        return this.model
            .findOne(opts.criteria).exec();
    }

    public insertOne(opts: InsertOneOptions): Promise<any> {
        return this.model
            .create(opts.propsToInsert);
    }

    public updateOne(opts: UpdateOneOptions): Promise<any> {
        return this.model
            .findOneAndUpdate(opts.criteria, opts.propsToUpdate, { new: true }).exec();
    }

    public removeOne(opts: RemoveOneOptions): Promise<any> {
        return this.model
            .findOneAndRemove(opts.criteria).exec();
    }
}