import { Page } from '../../pager';
import { PropertyCheckerFactory } from '../../utilities';
import { DataSourceQueries, CountOptions, FindOptions, FindOneOptions, InsertOneOptions, UpdateOneOptions, RemoveOneOptions } from '../index';

export interface DataSourceOptions {
    dataSourceQueries: DataSourceQueries;
}

export class DataSource {
    public dataSourceQueries: DataSourceQueries;

    constructor(opts: DataSourceOptions) {
        PropertyCheckerFactory(opts, 'dataSourceQueries').isPresent();

        this.dataSourceQueries = opts.dataSourceQueries;
    }

    public count(opts: CountOptions): Promise<number> {
        PropertyCheckerFactory(opts, 'criteria').isPresent();
        
        return this.dataSourceQueries.count(opts);
    }

    public find(opts: FindOptions): Promise<any[]> {
        PropertyCheckerFactory(opts, 'criteria').isPresent();
        PropertyCheckerFactory(opts, 'take').isInteger().isGtThanOrEqTo(0);
        PropertyCheckerFactory(opts, 'skip').isInteger().isGtThanOrEqTo(0);

        return this.dataSourceQueries.find(opts);
    }

    public findOne(opts: FindOneOptions): Promise<any> {
        PropertyCheckerFactory(opts, 'criteria').isPresent();

        return this.dataSourceQueries.findOne(opts);
    }

    public insertOne(opts: InsertOneOptions): Promise<any> {
        PropertyCheckerFactory(opts, 'propsToInsert').isPresent().isObject().isNotEmpty();

        return this.dataSourceQueries.insertOne(opts);
    }

    public updateOne(opts: UpdateOneOptions): Promise<any> {
        PropertyCheckerFactory(opts, 'criteria').isPresent();
        PropertyCheckerFactory(opts, 'propsToUpdate').isPresent().isObject().isNotEmpty();
        
        return this.dataSourceQueries.updateOne(opts);
    }

    public removeOne(opts: RemoveOneOptions): Promise<any> {
        PropertyCheckerFactory(opts, 'criteria').isPresent();
        
        return this.dataSourceQueries.removeOne(opts);
    }
}