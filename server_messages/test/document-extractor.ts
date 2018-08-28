import { ObjectCreatorTesterFactory } from '../../utilities';
import { DocumentExtractor, RequestExtractor } from '../index';
import { getGoodDocumentExtractorOptions } from './helpers/get-good-options';
import { assert } from 'chai';

describe('DocumentExtractor', function () {
    ObjectCreatorTesterFactory(DocumentExtractor).inheritsFrom(RequestExtractor);
    ObjectCreatorTesterFactory(DocumentExtractor, getGoodDocumentExtractorOptions()).isCreatedSuccessfully();

    describe('creating DocumentExtractor when', function () {
        ObjectCreatorTesterFactory(DocumentExtractor, getGoodDocumentExtractorOptions(), 'fieldsToExtract').isAbsent().isNotA(Set).isEmpty();
        ObjectCreatorTesterFactory(DocumentExtractor, getGoodDocumentExtractorOptions(), 'request.body').isAbsent().isNotAnObject().isEmpty();
    });

    describe('calling extract', function () {
        describe('when request has all fields that need to be extracted', function () {
            let result: any,
                actualResult: any;

            beforeEach(function () {
                actualResult = {
                    field1: 'field1',
                    field2: 'field2',
                    complexField1: {
                        field1: 'complexField1.field1',
                        field2: 'complexField1.field2'
                    },
                    complexField2: {
                        complexField1: {
                            field1: 'complexField2.complexField1.field1',
                            field2: 'complexField2.complexField1.field2'
                        }
                    }
                };

                let opts = getGoodDocumentExtractorOptions();
                opts.request.body = actualResult;

                result = new DocumentExtractor(opts).extract();
            });

            it('all fields are returned', function () {
                assert.deepEqual(result, actualResult);
            });
        });

        describe('when request has some of the fields that need to be extracted', function () {
            let result: any,
                actualResult: any;

            beforeEach(function () {
                actualResult = {
                    field1: 'field1',
                    complexField1: {
                        field1: 'complexField1.field1',
                    },
                    complexField2: {
                        complexField1: {
                            field1: 'complexField2.complexField1.field1',
                        }
                    }
                };

                let opts = getGoodDocumentExtractorOptions();
                opts.request.body = actualResult;

                result = new DocumentExtractor(opts).extract();
            });

            it('only those fields are returned', function () {
                assert.deepEqual(result, actualResult);
            });
        });

        describe('when request has no fields that need to be extracted', function () {
            let documentExtractor: DocumentExtractor;

            beforeEach(function () {
                let opts = getGoodDocumentExtractorOptions();
                opts.request.body = {
                    field666: 'field666',
                    complexField666: {
                        field666: 'complexField666.field666',
                    }
                };

                documentExtractor = new DocumentExtractor(opts);
            });

            it('throws an exception \"There are no required fields in a request\"', function () {
                assert.throws(() => { documentExtractor.extract(); }, 'There are no required fields in a request');
            });
        });
    });
});