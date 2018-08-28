import { SchemaType, Model, Document } from 'mongoose';

export enum MongoDbValidationRule {
    Required,
    StringMinLength,
    StringMaxLength,
    ArrayMinLength,
    ArrayMaxLength
}

export interface MongoDbModelPropertyConfiguration {
    propName: string;
    propType: SchemaType;
    isRelation?: boolean;
    validationRules: MongoDbValidationRule[];
}

export interface MongoDbModelFactoryOptions {
    modelName: string;
    modelCollectionName: string;
    propConfigs: MongoDbModelPropertyConfiguration[];
}

export class MongoDbModelFactory {
    public static createModel(opts: MongoDbModelFactoryOptions): Model<Document> {
        let schemaConfig = {};

        for (let propConfig of opts.propConfigs) {
            schemaConfig[propConfig.propName] = { type: propConfig.propType };

            
        }
    }
}