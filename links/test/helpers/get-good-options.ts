import { LinksOptions, RelationsLinksOptions, PageLinksOptions } from '../../index';
import { Pager } from '../../../pager';
import { URL } from 'url';

export function getGoodLinksOptions(): LinksOptions {
    return { url: new URL('http://myhost/segm1/segm2') };
}

export function getGoodRelationsLinksOptions(): RelationsLinksOptions {
    return { ...getGoodLinksOptions(), id: 'id', relations: new Set(['relation1', 'relation2', 'relation3']) };
}

export function getGoodPageLinksOptions(): PageLinksOptions {
    return { ...getGoodLinksOptions(), currentPageNumber: 4, pager: new Pager({ pageSize: 20, totalSize: 100 }) }
}