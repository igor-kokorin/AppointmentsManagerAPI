import * as fs from 'fs';
import * as path from 'path';
import * as Ajv from 'ajv';
import { fail } from 'assert';

function getSchema(schemaName: string): any {
    let fullPathToSchemaFile = path.join(__dirname, '..', 'api_results_json_schemas', `${schemaName}.schema.json`); 
    let schema = fs.readFileSync(fullPathToSchemaFile, { encoding: 'UTF-8' });
    return JSON.parse(schema);
}

export default function validateObjectAgainstSchema(obj: any, schemaName: string): boolean {
    let ajv = new Ajv(<any>{ logger: undefined });
    let schema = getSchema(schemaName);
    let validate = ajv.compile(schema);
    return <boolean>validate(obj);
}