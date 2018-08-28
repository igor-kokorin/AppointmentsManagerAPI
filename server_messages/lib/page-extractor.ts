import { RequestExtractor, RequestExtractorOptions } from '../index';
import { PropertyCheckerFactory } from '../../utilities';
import { Page } from '../../pager';

export interface PageExtractorOptions extends RequestExtractorOptions {
}

export class PageExtractor extends RequestExtractor<PageExtractorOptions> {
    constructor(opts: PageExtractorOptions) {
        super(opts);

        PropertyCheckerFactory(this.opts, 'request.params').isPresent().isObject().isNotEmpty();
    }

    public extract(): Page {
        let params = this.opts.request.params;
        let pageNumber = Number(params.pageNumber);
        let pageSize = Number(params.pageSize);

        if (Number.isNaN(pageNumber) || (pageNumber <= 0)) {
            pageNumber = 1;
        }

        if (Number.isNaN(pageSize) || (pageSize <= 0)) {
            pageSize = 20;
        }

        return new Page({ pageNumber, pageSize });
    }
}