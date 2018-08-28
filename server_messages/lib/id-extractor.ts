import { Request } from 'express';
import { RequestExtractor, RequestExtractorOptions } from '../index';
import { PropertyCheckerFactory } from '../../utilities';

export interface IdExtractorOptions extends RequestExtractorOptions {
}

export class IdExtractor extends RequestExtractor<IdExtractorOptions> {
    constructor(opts: IdExtractorOptions) {
        super(opts);

        PropertyCheckerFactory(this.opts, 'request.params').isPresent().isObject().isNotEmpty();
    }
    
    public extract() {
        let id = this.opts.request.params.id;

        if (!id) {
            throw 'Id must be set on a request';
        }

        return id;
    }
}