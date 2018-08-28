import { ObjectCreatorTesterFactory } from '../../utilities';
import { RequestExtractor } from '../index';
import { getGoodRequestExtractorOptions } from './helpers';

describe('RequestExtractor', function () {
    ObjectCreatorTesterFactory(RequestExtractor, getGoodRequestExtractorOptions()).isCreatedSuccessfully();

    describe('creating RequestExtractor when', function () {
        ObjectCreatorTesterFactory(RequestExtractor, getGoodRequestExtractorOptions(), 'request').isAbsent();
    });
});