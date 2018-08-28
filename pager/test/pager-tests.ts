import { Page, Pager, PageOptions, PagerOptions } from '../index';
import { assert } from 'chai';
import { PagerTester, getGoodPageOptions, getGoodPagerOptions } from './helpers';
import { ObjectCreatorTesterFactory } from '../../utilities';

describe('Page', function () {
    ObjectCreatorTesterFactory(Page, getGoodPageOptions()).isCreatedSuccessfully();

    describe('creating Page (sad paths) with', function () {
        ObjectCreatorTesterFactory(Page, getGoodPageOptions(), 'pageNumber').isAbsent().isNotAnInteger().isNotGtThanOrEqTo(1);
        ObjectCreatorTesterFactory(Page, getGoodPageOptions(), 'pageSize').isAbsent().isNotAnInteger().isNotGtThanOrEqTo(1);
    });
});

describe('Pager', function () {
    ObjectCreatorTesterFactory(Pager, getGoodPagerOptions()).isCreatedSuccessfully();

    describe('creating Pager (sad paths)', function () {
        ObjectCreatorTesterFactory(Pager, getGoodPagerOptions(), 'pageSize').isAbsent().isNotAnInteger().isNotGtThanOrEqTo(1);
        ObjectCreatorTesterFactory(Pager, getGoodPagerOptions(), 'totalSize').isAbsent().isNotAnInteger().isNotGtThanOrEqTo(0);

        describe('with totalSize < pageSize', function () {
            it('sets pageSize to totalSize', function () {
                let pagerOpts: PagerOptions;
                pagerOpts = <PagerOptions>{ pageSize: 70, totalSize: 50 };
                let pager = new Pager(pagerOpts);
                assert.strictEqual(pager.pageSize, pager.totalSize);
            });
        });
    });

    PagerTester.test({ pageSize: 20, totalSize: 100 });
    PagerTester.test({ pageSize: 10, totalSize: 60 });
    PagerTester.test({ pageSize: 13, totalSize: 40 });
    PagerTester.test({ pageSize: 7, totalSize: 80 });
    PagerTester.test({ pageSize: 3, totalSize: 70 });
    PagerTester.test({ pageSize: 1, totalSize: 1 });
    PagerTester.test({ pageSize: 30, totalSize: 30 });
});