import { EntityFactory, EntityFactoryOptions } from '../../entities';
import * as mongoose from 'mongoose';
import './models';

export class MongoDbEntityFactory implements EntityFactory {
    public create(opts: EntityFactoryOptions): any {
        let model = mongoose.model(opts.entityName);
        return new model(opts.entityProps);
    }
}