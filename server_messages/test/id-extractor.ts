import { ObjectCreatorTesterFactory } from '../../utilities';
import * as express from 'express';
import { assert } from 'chai';
import { IdExtractor, RequestExtractor } from '../index';
import { getGoodIdExtractorOptions } from './helpers';

describe('IdExtractor', function () {
    ObjectCreatorTesterFactory(IdExtractor).inheritsFrom(RequestExtractor);
    ObjectCreatorTesterFactory(IdExtractor, getGoodIdExtractorOptions()).isCreatedSuccessfully();

    describe('creating IdExtractor when', function () {
        ObjectCreatorTesterFactory(IdExtractor, getGoodIdExtractorOptions(), 'request.params').isAbsent().isNotAnObject().isEmpty();
    });

    describe('calling extract', function () {
        describe('when request has an id', function () {
            let result: string;

            beforeEach(function () {
                let opts = getGoodIdExtractorOptions();
                opts.request.params = { someOtherParam1: 'someOtherParam1', id: 'identifier', someOtherParam2: 'someOtherParam2' };
                
                result = new IdExtractor(opts).extract();
            });

            it('returnes this id', function () {
                assert.strictEqual(result, 'identifier');
            });
        });
    
        describe('when request has no id', function () {let result: string;
            let idExtractor: IdExtractor;

            beforeEach(function () {
                let opts = getGoodIdExtractorOptions();
                opts.request.params = { someOtherParam1: 'someOtherParam1', someOtherParam2: 'someOtherParam2' };
                
                idExtractor = new IdExtractor(opts);
            });

            it('throws an exception \"Id must be set on a request\"', function () {
                assert.throws(() => { idExtractor.extract(); }, 'Id must be set on a request');
            });
        });
    });
});