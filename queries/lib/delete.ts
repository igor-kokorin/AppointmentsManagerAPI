import { CommonQueryOptions, QueryBase, QueryResult, IdCriteria, QueryResultMessages } from '../index';
import * as Promise from 'bluebird';
import { PropertyCheckerFactory } from '../../utilities';

export interface DeleteQueryOptions extends CommonQueryOptions {
    deleteCriteria: IdCriteria;
}

export class DeleteQuery extends QueryBase<DeleteQueryOptions> {
    constructor(opts: DeleteQueryOptions) {
        super(opts);

        PropertyCheckerFactory(this.opts, 'deleteCriteria').isPresent().isOfType(IdCriteria);
    }

    public exec(): Promise<QueryResult> {
        let model = this.opts.dbHandle;
        let criteria = this.opts.deleteCriteria;

        return Promise.cast(model.findOne(criteria).exec())
            .then((doc) => {
                if (!doc) {
                    return QueryResult.failure(QueryResultMessages.noDocsThatSatisfyGivenCriteria());
                }

                return doc.remove()
                    .then((result) => {
                        return QueryResult.success(QueryResultMessages.docDeletedSuccessfully());
                    });
            });
    }
}