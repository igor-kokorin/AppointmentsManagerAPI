import { DefaultValueSetter, PropertyCheckerFactory } from '../../utilities';
import { Page, Pager } from '../../pager';
import { QueryResult } from './query-result';
import { QueryBase, CommonQueryOptions } from './base-query';
import { QueryResultMessages } from '../index';
import { DataSource, FindOptions } from '../../data_source';

export interface GetQueryOptions extends CommonQueryOptions {
}

export interface GetQueryExecuteOptions {
    page: Page;
    criteria?: any;
    sortOptions?: any;
}

export class GetQuery extends QueryBase {
    constructor(opts: GetQueryOptions) {
        super(opts);
    }

    public execute(opts: GetQueryExecuteOptions): Promise<QueryResult> {
        PropertyCheckerFactory(opts, 'criteria').isPresent();
        PropertyCheckerFactory(opts, 'sortOptions').isPresent();
        PropertyCheckerFactory(opts, 'page').isPresent().isOfType(Page);

        let page = opts.page;
        let dataSource = this.dataSource;

        return dataSource.count({ criteria: opts.criteria })
            .then((totalResultsCount) => {
                if (totalResultsCount === 0) {
                    return QueryResult.failure(QueryResultMessages.noEntitiesThatSatisfyGivenCriteria());
                }

                let pager = new Pager({ pageSize: page.pageSize, totalSize: totalResultsCount });
                let actuallySizedPage = pager.getPageByNumber(page.pageNumber);

                if (!actuallySizedPage) {
                    return QueryResult.failure(QueryResultMessages.pageOutOfResultsRange());
                }

                return dataSource.find({
                    criteria: opts.criteria,
                    skip: (page.pageNumber - 1) * page.pageSize,
                    take: actuallySizedPage.pageSize,
                    sortOptions: opts.sortOptions
                }).then((results) => {
                    return QueryResult.success(results);
                });
            });
    }
}