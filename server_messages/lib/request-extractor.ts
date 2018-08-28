import { CommonBaseType, PropertyCheckerFactory } from '../../utilities';
import { Request } from 'express';

export interface RequestExtractorOptions {
    request: Request;
}

export abstract class RequestExtractor<T extends RequestExtractorOptions> extends CommonBaseType<T> {
    constructor(opts: T) {
        super(opts);

        PropertyCheckerFactory(this.opts, 'request').isPresent();
    }

    public abstract extract(): any;
}