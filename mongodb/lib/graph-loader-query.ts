import { Model, Document } from 'mongoose';
import { PropertyCheckerFactory, ObjectHelper } from '../../utilities';
import { GraphLoaderQueryLoadOptions } from '../../data_source';
import { MongoDbRelation } from './relations';

export interface MongoDbGraphLoaderQueryOptions {
    model: Model<Document>;
}

export interface MongoDbGraphLoaderQueryLoadOptions {
    userId: any;
    dataItems: Document[];
    relations: MongoDbRelation[];
}

export class MongoDbGraphLoaderQuery {
    public model: Model<Document>;

    constructor(opts: MongoDbGraphLoaderQueryOptions) {
        PropertyCheckerFactory(opts, 'model').isPresent();

        this.model = opts.model;
    }

    private _preparePopulateOptions(userId: any, relations: MongoDbRelation[]) {
        let populateConfigs = [];
        
        for (let relation of relations) {
            let populateConfig = { path: relation.name, model: relation.modelName };

            if (relation.isAssignedToUser) {
                populateConfig['match'] = { userId };
            }

            populateConfigs.push(populateConfig);

            if (relation.relations) {
                populateConfig['populate'] = this._preparePopulateOptions(userId, relation.relations);
            }
        }

        return populateConfigs;
    }

    public load(opts: MongoDbGraphLoaderQueryLoadOptions): Promise<any[]> {
        let populateOptions = this._preparePopulateOptions(opts.userId, opts.relations);
        
        return this.model.populate(opts.dataItems, populateOptions).then((result) => {
            return result;
        });
    }
}