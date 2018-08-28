import { PropertyCheckerFactory, CommonBaseType } from '../../utilities';

export interface PageOptions {
    pageNumber: number;
    pageSize: number;
}

export class Page {
    public pageNumber: number;
    public pageSize: number;

    constructor(opts: PageOptions) {
        PropertyCheckerFactory(opts, 'pageNumber').isPresent().isInteger().isGtThanOrEqTo(1);
        PropertyCheckerFactory(opts, 'pageSize').isPresent().isInteger().isGtThanOrEqTo(1);

        this.pageNumber = opts.pageNumber;
        this.pageSize = opts.pageSize;
    }
}