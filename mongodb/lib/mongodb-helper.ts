import * as _ from 'underscore';
import { Model, Document } from 'mongoose';

export class MongoDbHelper {
    public static setUnderscoreId(obj: object, id: string) {
        let document = _.clone(obj);
        document['_id'] = id;
        return document;
    }
}