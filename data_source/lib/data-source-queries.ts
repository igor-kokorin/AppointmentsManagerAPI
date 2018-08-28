export interface CountOptions {
    criteria: any;
}

export interface FindOneOptions {
    criteria: any;
}

export interface FindOptions {
    criteria: any;
    sortOptions?: any;
    take?: number;
    skip?: number;
}

export interface InsertOneOptions {
    propsToInsert: object;
}

export interface UpdateOneOptions {
    criteria: any;
    propsToUpdate: object;
}

export interface RemoveOneOptions {
    criteria: any;
}

export interface DataSourceQueries {
    count(opts: CountOptions): Promise<number>;
    find(opts: FindOptions): Promise<any[]>;
    findOne(opts: FindOneOptions): Promise<any>;
    insertOne(opts: InsertOneOptions): Promise<any>;
    updateOne(opts: UpdateOneOptions): Promise<any>;
    removeOne(opts: RemoveOneOptions): Promise<any>;
}