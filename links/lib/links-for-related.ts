import { Links, LinksOptions } from './links';
import { PropertyCheckerFactory } from '../../utilities';

export interface RelationsLinksOptions extends LinksOptions {
    id: string;
    relations: Set<string>;
}

export class RelationsLinks extends Links {
    public id: string;
    public relations: Set<string>;
    
    constructor(opts: RelationsLinksOptions) {
        super(opts);

        PropertyCheckerFactory(opts, 'id').isPresent().isString().isNotEmpty();
        PropertyCheckerFactory(opts, 'relations').isPresent().isNotEmpty();

        this.id = opts.id;
        this.relations = opts.relations;
    }

    public getLinks(): { [key: string]: string } {
        let links = {};

        for (let rel of this.relations) {
            links[rel] =
                this.url.origin
                + this.url.pathname 
                + (this.url.pathname[this.url.pathname.length - 1] === '/' ? '' : '/') 
                + this.id + '/' + rel;
        }

        return links;
    }
}