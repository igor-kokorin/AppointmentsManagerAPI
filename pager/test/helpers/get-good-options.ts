import { PageOptions } from '../../index';

export function getGoodPageOptions(): PageOptions {
    return { pageNumber: 2, pageSize: 30 };
}

export function getGoodPagerOptions() {
    return { pageSize: 40, totalSize: 1000 };
}