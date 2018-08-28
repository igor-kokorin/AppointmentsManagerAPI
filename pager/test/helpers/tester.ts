import { assert } from 'chai'; 
import { Pager, PagerOptions } from '../../index';
import { PagerTesterOutcomesGenerator } from './index';

export class PagerTester {
    public static test(pagerOpts: PagerOptions): void {
        let outcomes = new PagerTesterOutcomesGenerator(pagerOpts).generate();

        describe(`having pager with ${JSON.stringify(pagerOpts)}`, function () {
            let pager: Pager;
            
            beforeEach(function () {
                pager = new Pager(pagerOpts);
            });
            
            it(`accessing firtsPage returns ${JSON.stringify(outcomes.firstPage)}`, function () {
                assert.deepEqual(pager.firstPage, outcomes.firstPage);
            });
            
            it(`accessing lastPage returns ${JSON.stringify(outcomes.lastPage)}`, function () {
                assert.deepEqual(pager.lastPage, outcomes.lastPage);
            });

            describe('good cases for getPageByNumber', function () {
                for (let i = 0; i < outcomes.getPageByNumberGood.length; i++) {
                    let goodOutcome = outcomes.getPageByNumberGood[i];

                    it(`calling getPageByNumber with \`${goodOutcome.number}\` returns ${JSON.stringify(goodOutcome.outcome)}`, function () {
                        assert.deepEqual(pager.getPageByNumber(goodOutcome.number), goodOutcome.outcome);
                    });
                }
            });
            
            describe('bad cases for getPageByNumber', function () {
                for (let i = 0; i < outcomes.getPageByNumberBad.length; i++) {
                    let badOutcome = outcomes.getPageByNumberBad[i];

                    it(`calling getPageByNumber with \`${badOutcome}\` returns \`null\``, function () {
                        assert.isNull(pager.getPageByNumber(badOutcome));
                    });
                }
            });

            it(`accessing totalNumberOfPages returns \`${outcomes.totalNumberOfPages}\``, function () {
                assert.strictEqual(pager.totalNumberOfPages, outcomes.totalNumberOfPages);
            });
        });
    }
}