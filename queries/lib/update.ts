import { QueryBase, CommonQueryOptions } from './base-query';
import { QueryResult } from './query-result';
import { PropertyCheckerFactory } from '../../utilities';
import * as Promise from 'bluebird';
import * as _ from 'underscore';
import { IdCriteria, QueryResultMessages } from '../index';

export interface UpdateQueryOptions extends CommonQueryOptions {
    updateCriteria: IdCriteria;
    propsToUpdate: any;
}

export class UpdateQuery extends QueryBase<UpdateQueryOptions> {
    constructor(opts: UpdateQueryOptions) {
        super(opts);

        PropertyCheckerFactory(this.opts, 'updateCriteria').isPresent().isOfType(IdCriteria);
        PropertyCheckerFactory(this.opts, 'propsToUpdate').isPresent().isNotEmpty();
    }

    public exec(): Promise<QueryResult> {
        let model = this.opts.dbHandle;
        let criteria = this.opts.updateCriteria;
        let propsToUpdate = this.opts.propsToUpdate;

        return Promise.cast(model.findOne(criteria).exec())
            .then((docToUpdate) => {
                if (!docToUpdate) {
                    return QueryResult.failure(QueryResultMessages.noDocsThatSatisfyGivenCriteria());
                }
                
                _.extendOwn(docToUpdate, propsToUpdate);

                return docToUpdate.save()
                    .then((updatedDoc) => {
                        return QueryResult.success(updatedDoc);
                    });
            })
            .catch((error) => {
                if (error.name === 'ValidationError') {
                    return QueryResult.failure({ name: error.name, errors: error.errors });
                }
            });
    }
}