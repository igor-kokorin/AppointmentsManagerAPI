import { PropertyCheckerFactory } from '../../utilities';

export interface QueryCriteriaOptions {
    dataSourceMapper: DataSourceMapper;
}

export class QueryCriteria {
    constructor(opts: QueryCriteriaOptions) {
        PropertyCheckerFactory(opts, 'dataSourceMapper').isPresent();
    }

    public addCriteria() {

    }

    public transformToDataSourceCriteria() {

    }
}