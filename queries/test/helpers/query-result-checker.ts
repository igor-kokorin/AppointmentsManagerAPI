import { assert } from 'chai';
import { QueryResult } from '../../index';
import * as Promise from 'bluebird';

export class QueryResultChecker {
    public static isSuccess(queryResult: QueryResult) {
        assert.isTrue(queryResult.success);
    }

    public static isValidationFailure(queryResult: QueryResult) {
    }

    public static isFailure(queryResult: QueryResult, errorMessage: string) {
        assert.isFalse(queryResult.success);
        
        assert.strictEqual(queryResult.data, errorMessage, `reason for error must be \"${errorMessage}\"`);
    }
}