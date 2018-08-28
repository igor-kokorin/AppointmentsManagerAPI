import { QueryResult } from './query-result';
import { QueryBase, CommonQueryOptions } from './base-query';
import { PropertyCheckerFactory } from '../../utilities';

export interface Validator {
    validate(entity: any);
}

export interface PostQueryOptions extends CommonQueryOptions {
    validator: Validator;
}

export interface PostQueryExecuteOptions {
    propsToInsert: any;
}

export class PostQuery extends QueryBase {
    public validator: Validator;
    
    constructor(opts: PostQueryOptions) {
        PropertyCheckerFactory(opts, 'validator').isPresent();

        super(opts);

        this.validator = opts.validator;
    }

    public execute(opts: PostQueryExecuteOptions): Promise<QueryResult> {
        let validationErrors = this.validator.validate(opts.propsToInsert);

        if (validationErrors) {
            return this.dataSource.insertOne({ propsToInsert: opts.propsToInsert })
                .then((result) => {
                    return QueryResult.success(result);
                });
        } else {
            return Promise.resolve(QueryResult.failure(validationErrors));
        }
    }
}