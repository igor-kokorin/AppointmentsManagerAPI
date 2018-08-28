export interface GraphLoaderQueryLoadOptions {
    userId: any;
    dataItems: any[];
    relations: any[];
}

export interface GraphLoaderQuery {
    load(opts: GraphLoaderQueryLoadOptions): Promise<any[]>;
}