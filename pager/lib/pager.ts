import { PropertyCheckerFactory, CommonBaseType } from '../../utilities';
import { Page } from './page';

export interface PagerOptions {
    pageSize: number;
    totalSize: number;
}

export class Pager {
    public pageSize: number;
    public totalSize: number;

    constructor(opts: PagerOptions) {
        PropertyCheckerFactory(opts, 'pageSize').isPresent().isInteger().isGtThanOrEqTo(1);
        PropertyCheckerFactory(opts, 'totalSize').isPresent().isInteger().isGtThanOrEqTo(1);

        this.totalSize = opts.totalSize;
        this.pageSize = (opts.pageSize <= this.totalSize) ? opts.pageSize : opts.totalSize;
    }

    public get firstPage(): Page {
        return new Page({ pageNumber: 1, pageSize: this.pageSize });
    }

    public get lastPage(): Page {
        let numberOfPages = this.totalNumberOfPages;
        let totalSize = this.totalSize;
        let pageSize = this.pageSize;
        pageSize = totalSize - (numberOfPages - 1) * pageSize;

        return new Page({ pageNumber: numberOfPages, pageSize });
    }

    public previousTo(page: Page) {
        return this.getPageByNumber(page.pageNumber - 1);
    }

    public nextTo(page: Page) {
        return this.getPageByNumber(page.pageNumber + 1);
    }

    public get totalNumberOfPages() {
        return Math.ceil(this.totalSize / this.pageSize);
    }

    public getPageByNumber(pageNumber: number): Page {
        if (pageNumber > 0 && pageNumber <= this.totalNumberOfPages) {
            return new Page({
                pageNumber,
                pageSize:
                    pageNumber * this.pageSize < this.totalSize
                        ? this.pageSize
                        : Math.ceil(this.totalSize - (this.pageSize * (pageNumber - 1)))
            });
        } else {
            return null;
        }
    }
}