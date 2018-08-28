export interface EntityFactoryOptions {
    entityName: string;
    entityProps: object;
}

export interface EntityFactory {
    create(opts: EntityFactoryOptions): any;
}