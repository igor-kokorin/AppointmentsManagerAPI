import { assert } from 'chai';
import { Links, PageLinks, PageLinksOptions } from '../index';
import { ObjectCreatorTesterFactory } from '../../utilities';
import { URL } from 'url';
import { Pager } from '../../pager';
import { getGoodPageLinksOptions } from './helpers';

describe('PagerLinks', function () {
    ObjectCreatorTesterFactory(PageLinks).inheritsFrom(Links);
    ObjectCreatorTesterFactory(PageLinks, getGoodPageLinksOptions()).isCreatedSuccessfully();

    describe('creating PagerLinks', function () {
        ObjectCreatorTesterFactory(PageLinks, getGoodPageLinksOptions(), 'pager').isAbsent();
        ObjectCreatorTesterFactory(PageLinks, getGoodPageLinksOptions(), 'currentPageNumber').isAbsent().isNotAnInteger().isNotGtThanOrEqTo(1).isNotLtThanOrEqTo('pager.totalNumberOfPages');        
    });

    describe('calling getLinks', function () {
        const testData: Array<{ 
            opts: PageLinksOptions,
            result: {
                currentPage: string,
                firstPage: string,
                lastPage: string,
                previousPage?: string,
                nextPage?: string }
            }> = [{
                opts: { url: new URL('http://localhost.com/api/appointments'), currentPageNumber: 1, pager: new Pager({ pageSize: 20, totalSize: 100 }) },
                result: {
                    currentPage: 'http://localhost.com/api/appointments?pageNumber=1&pageSize=20',
                    firstPage: 'http://localhost.com/api/appointments?pageNumber=1&pageSize=20',
                    lastPage: 'http://localhost.com/api/appointments?pageNumber=5&pageSize=20',
                    nextPage: 'http://localhost.com/api/appointments?pageNumber=2&pageSize=20'
                }
            },
            {
                opts: { url: new URL('http://localhost.com/api/appointments'), currentPageNumber: 5, pager: new Pager({ pageSize: 10, totalSize: 200 }) },
                result:  {
                    currentPage: 'http://localhost.com/api/appointments?pageNumber=5&pageSize=10',
                    firstPage: 'http://localhost.com/api/appointments?pageNumber=1&pageSize=10',
                    lastPage: 'http://localhost.com/api/appointments?pageNumber=20&pageSize=10',
                    nextPage: 'http://localhost.com/api/appointments?pageNumber=6&pageSize=10',
                    previousPage: 'http://localhost.com/api/appointments?pageNumber=4&pageSize=10'
                }
            },
            {
                opts: { url: new URL('http://localhost.com/api/appointments'), currentPageNumber: 4, pager: new Pager({ pageSize: 14, totalSize: 50 }) },
                result:  {
                    currentPage: 'http://localhost.com/api/appointments?pageNumber=4&pageSize=8',
                    firstPage: 'http://localhost.com/api/appointments?pageNumber=1&pageSize=14',
                    lastPage: 'http://localhost.com/api/appointments?pageNumber=4&pageSize=8',
                    previousPage: 'http://localhost.com/api/appointments?pageNumber=3&pageSize=14'
                }
            },
            {
                opts: { url: new URL('http://localhost.com/api/appointments'), currentPageNumber: 1, pager: new Pager({ pageSize: 50, totalSize: 50 }) },
                result:  {
                    currentPage: 'http://localhost.com/api/appointments?pageNumber=1&pageSize=50',
                    firstPage: 'http://localhost.com/api/appointments?pageNumber=1&pageSize=50',
                    lastPage: 'http://localhost.com/api/appointments?pageNumber=1&pageSize=50'
                }
            }
        ];
    
        for (let el of testData) {
            it(`with opts=${JSON.stringify(el.opts)} returns ${JSON.stringify(el.result)}`, function () {
                let links = new PageLinks(el.opts).getLinks();
                assert.deepInclude(links, el.result);
                assert.hasAllDeepKeys(links, el.result);
            });
        }
    });
});