import { Page, PagerOptions } from '../../index'

export interface PagerTesterOutcomes {
    firstPage: Page;
    lastPage: Page;
    getPageByNumberGood: [{
        number: number;
        outcome: Page;
    }],
    getPageByNumberBad: number[],
    totalNumberOfPages: number
}

export class PagerTesterOutcomesGenerator {
    constructor(private pagerOpts: PagerOptions) {
    }

    private _calculatePageSize(pageNumber: number) {
        return ((this.pagerOpts.pageSize * pageNumber) < this.pagerOpts.totalSize) 
            ? this.pagerOpts.pageSize
            : (this.pagerOpts.totalSize - (this.pagerOpts.pageSize * (pageNumber - 1)));
    }

    private _calculateTotalNumberOfPages() {
        return this.pagerOpts.pageSize === 0
            ? 0
            : Math.ceil(this.pagerOpts.totalSize / this.pagerOpts.pageSize);
    }

    private _getFirstPageOutcome(): Page {
        return new Page({
            pageNumber: 1, 
            pageSize: this.pagerOpts.pageSize
        });
    }

    private _getLastPageOutcome(): Page {
        let pageNumber = this._calculateTotalNumberOfPages();
        let pageSize = this._calculatePageSize(pageNumber);

        return new Page({
            pageNumber, 
            pageSize
        });
    }

    private _getPageByNumberGoodOutcomes(): [{ number: number, outcome: Page }] {
        let outcomes = <[{ number: number, outcome: Page }]>[];
        let totalNumberOfPages = this._calculateTotalNumberOfPages();

        for (let i = 1; i <= totalNumberOfPages; i++) {
            let pageSize = this._calculatePageSize(i);

            outcomes.push({
                number: i,
                outcome: new Page({ pageNumber: i, pageSize })
            });
        }

        return outcomes;
    }

    private _getPageByNumberBadOutcomes(): number[] {
        let numberOfPages = this._calculateTotalNumberOfPages();
        
        return [ 0, numberOfPages + 1 ];
    }

    public generate(): PagerTesterOutcomes {
        return {
            firstPage: this._getFirstPageOutcome(),
            lastPage: this._getLastPageOutcome(),
            getPageByNumberGood: this._getPageByNumberGoodOutcomes(),
            getPageByNumberBad: this._getPageByNumberBadOutcomes(),
            totalNumberOfPages: this._calculateTotalNumberOfPages()
        };
    }
}