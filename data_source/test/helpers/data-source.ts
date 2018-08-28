import { DataSourceOptionsGenerator } from './index';
import { DataSource } from '../../index';
import * as Promise from 'bluebird';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { assert } from 'chai';

type DataSourceConstructorType = { new (...args): any; name: string };

export class DataSourceHelper {
    public queryResult: any;

    public readonly dataSourceConstructor: DataSourceConstructorType;
    public readonly dataSourceName: string;
    public readonly dataSourceQueryOption: string;

    constructor(dataSourceConstructor: DataSourceConstructorType, dataSourceQueryOption: string) {
        this.dataSourceConstructor = dataSourceConstructor;
        this.dataSourceName = this.dataSourceConstructor.name;
        this.dataSourceQueryOption = dataSourceQueryOption;
    }

    public executeQuery(queryName: string, dataSourceQueriesResult: any) {
        let queryStub: SinonStub;
        let queryOpts: any;

        let self = this;

        beforeEach(function () {
            let dataSourceOpts = DataSourceOptionsGenerator['for' + self.dataSourceName + 'Constructor']();

            queryOpts = DataSourceOptionsGenerator['for' + self.dataSourceName + 'Query_' + queryName]();

            queryStub = sinon.stub(dataSourceOpts[self.dataSourceQueryOption], queryName)
                .returns(Promise.resolve(dataSourceQueriesResult));

            let dataSource = new self.dataSourceConstructor(dataSourceOpts);

            return dataSource[queryName](queryOpts).then((result) => {
                self.queryResult = result;
            });
        });

        it(`delegates work to ${self.dataSourceName}.${queryName}`, function () {
            assert.isTrue(queryStub.calledOnce, `${self.dataSourceName}.${queryName} must be called once`);
            assert.deepEqual(queryStub.firstCall.args[0], queryOpts, `${self.dataSourceName}.${queryName} must be called with given query parameters`);
        });
    }
}