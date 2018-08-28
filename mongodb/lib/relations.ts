export interface MongoDbRelation {
    name: string;
    modelName: string;
    isAssignedToUser: boolean;
    relations: [ MongoDbRelation ];
}