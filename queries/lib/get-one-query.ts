import { QueryBase, CommonQueryOptions } from './base-query';
import { QueryResult } from './query-result';
import { PropertyCheckerFactory } from '../../utilities';
import { QueryResultMessages } from './query-result-messages';

export interface GetOneQueryOptions extends CommonQueryOptions {
}

export interface GetOneQueryExecuteOptions {
    criteria: any;
}

export class GetOneQuery extends QueryBase {
    constructor(opts: GetOneQueryOptions) {
        super(opts);
    }

    public execute(opts: GetOneQueryExecuteOptions): Promise<QueryResult> {
        PropertyCheckerFactory(opts, 'criteria').isPresent();

        let dataSource = this.dataSource;

        return dataSource.findOne({ criteria: opts.criteria })
            .then((result) => {
                if (result) {
                    return QueryResult.success(result);
                } else {
                    return QueryResult.failure(QueryResultMessages.noEntityThatSatisfyGivenCriteria());
                }
            });
    }
}