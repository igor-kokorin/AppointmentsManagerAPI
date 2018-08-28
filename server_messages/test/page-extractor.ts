import { ObjectCreatorTesterFactory } from '../../utilities';
import { PageExtractor, PageExtractorOptions } from '../index';
import { RequestExtractor } from '../index';
import { getGoodPageExtractorOptions, PageExtractorTester } from './helpers';

describe('PageExtractor', function () {
    ObjectCreatorTesterFactory(PageExtractor).inheritsFrom(RequestExtractor);

    ObjectCreatorTesterFactory(PageExtractor, getGoodPageExtractorOptions()).isCreatedSuccessfully();

    describe('creating PageExtractor when', function () {
        ObjectCreatorTesterFactory(PageExtractor, getGoodPageExtractorOptions(), 'request.params').isAbsent().isNotAnObject().isEmpty();
    });

    describe('calling extract', function () {
        PageExtractorTester.happyPath();

        PageExtractorTester.whenRequestHasPageNumber(0, 'equal to 0');
        PageExtractorTester.whenRequestHasPageNumber(-67, 'less than 0');
        PageExtractorTester.whenRequestHasPageNumber('invalid page number', 'string');
        PageExtractorTester.whenRequestHasPageNumber(undefined, 'not present');
        
        PageExtractorTester.whenRequestHasPageSize(0, 'equal to 0');
        PageExtractorTester.whenRequestHasPageSize(-5, 'less than 0');
        PageExtractorTester.whenRequestHasPageSize('invalid page size', 'string');
        PageExtractorTester.whenRequestHasPageSize(undefined, 'not present');
    });
});