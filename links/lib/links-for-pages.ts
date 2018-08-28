import { Links, LinksOptions } from '../index';
import { Pager, Page } from '../../pager';
import { PropertyCheckerFactory } from '../../utilities';

export interface PageLinksOptions extends LinksOptions {
    currentPageNumber: number;
    pager: Pager;
}

export class PageLinks extends Links {
    public pager: Pager;
    public currentPageNumber: number;

    constructor(opts: PageLinksOptions) {
        super(opts);

        PropertyCheckerFactory(opts, 'pager').isPresent();
        PropertyCheckerFactory(opts, 'currentPageNumber').isPresent().isInteger().isGtThanOrEqTo(1).isLtThanOrEqTo(opts.pager.totalNumberOfPages);

        this.pager = opts.pager;
        this.currentPageNumber = opts.currentPageNumber;
    }

    private _convertPageToLink(page: Page): string {
        return this.url.origin + this.url.pathname
            + `?pageNumber=${page.pageNumber}&pageSize=${page.pageSize}`;
    }

    public getLinks() {
        let links = <{
            currentPage: string,
            firstPage: string,
            lastPage: string,
            previousPage?: string,
            nextPage?: string
        }>{};

        let currPage = this.pager.getPageByNumber(this.currentPageNumber);

        links.currentPage = this._convertPageToLink(currPage);
        links.firstPage = this._convertPageToLink(this.pager.firstPage);
        links.lastPage = this._convertPageToLink(this.pager.lastPage);
        
        let previousPage = this.pager.previousTo(currPage);
        if (previousPage) {
            links.previousPage = this._convertPageToLink(previousPage);
        }
        
        let nextPage = this.pager.nextTo(currPage);
        if (nextPage) {
            links.nextPage = this._convertPageToLink(nextPage);
        }
            
        return links;
    }
}