import * as mongoose from 'mongoose';

export interface MongoDbBootstrapperOptions {
    hostName: string;
    port: number;
    dbName: string;
}

export class MongoDbBootstrapper {
    public static bootstrapMongoDb(opts: MongoDbBootstrapperOptions) {
        return mongoose.connect(`mongodb://${opts.hostName}:${opts.port}/${opts.dbName}`);
    }
}