import { Page } from '../../../pager';
import { getGoodPageExtractorOptions } from './index';
import { PageExtractor, PageExtractorOptions } from '../../index';
import { assert } from 'chai';

const DEFAULT_PAGE_NUMBER = 1, DEFAULT_PAGE_SIZE = 20;

export class PageExtractorTester {
    public static happyPath() {
        describe('when request has valid page number and page size', function () {
            const PAGE_NUMBER = 7, PAGE_SIZE = 100;

            let result: Page;
            
            beforeEach(function () {
                let opts = getGoodPageExtractorOptions();
                opts.request.params = { someParameter1: 'someParameter1', pageNumber: PAGE_NUMBER, someParameter2: 'someParameter2', pageSize: PAGE_SIZE };

                result = (new PageExtractor(opts)).extract();
            });

            it('returnes page with page number set to request value', function () {
                assert.strictEqual(result.opts.pageNumber, PAGE_NUMBER);
            });

            it('returnes page with page size set to request value', function () {
                assert.strictEqual(result.opts.pageSize, PAGE_SIZE);
            });
        });
    }

    public static whenRequestHasPageNumber(value: any, message: string) {
        describe(`when request has page number whose value is ${message}`, function () {
            const PAGE_SIZE = 30;

            let result: Page;
            
            beforeEach(function () {
                let opts = getGoodPageExtractorOptions();
                opts.request.params = { someParameter1: 'someParameter1', pageSize: PAGE_SIZE, someParameter2: 'someParameter2', pageNumber: value };

                result = (new PageExtractor(opts)).extract();
            });

            it('returnes page with page size set to request value', function () {
                assert.strictEqual(result.opts.pageSize, PAGE_SIZE);
            });

            it(`returnes page with page number set to default value (${DEFAULT_PAGE_NUMBER})`, function () {
                assert.strictEqual(result.opts.pageNumber, DEFAULT_PAGE_NUMBER);
            });
        });
    }

    public static whenRequestHasPageSize(value: any, message: string) {
        describe(`when request has page size whose value is ${message}`, function () {
            const PAGE_NUMBER = 4;

            let result: Page;
            
            beforeEach(function () {
                let opts = getGoodPageExtractorOptions();
                opts.request.params = { someParameter1: 'someParameter1', pageSize: value, someParameter2: 'someParameter2', pageNumber: PAGE_NUMBER };

                result = (new PageExtractor(opts)).extract();
            });

            it('returnes page with page number set to request value', function () {
                assert.strictEqual(result.opts.pageNumber, PAGE_NUMBER);
            });

            it(`returnes page with page size set to default value (${DEFAULT_PAGE_SIZE})`, function () {
                assert.strictEqual(result.opts.pageSize, DEFAULT_PAGE_SIZE);
            });
        });
    }
}