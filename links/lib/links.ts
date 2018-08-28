import { URL } from 'url';
import { CommonBaseType, PropertyCheckerFactory } from '../../utilities';

export interface LinksOptions {
    url: URL;
}

export abstract class Links {
    public url: URL;

    constructor(opts: LinksOptions) {
        PropertyCheckerFactory(opts, 'url').isPresent();

        this.url = opts.url;
    }

    abstract getLinks(): { [key: string]: string };
}