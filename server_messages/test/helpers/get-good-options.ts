import { RequestExtractorOptions, IdExtractorOptions, DocumentExtractorOptions, UserInfoExtractorOptions } from '../../index';
import * as express from 'express';
import { PageExtractorOptions } from '../../index';

export function getGoodRequestExtractorOptions(): RequestExtractorOptions {
    return { request: Object.create((<any>express).request) };
}

export function getGoodIdExtractorOptions(): IdExtractorOptions {
    let commonExtractorOpts = getGoodRequestExtractorOptions();
    commonExtractorOpts.request.params = { param1: 'param1' };
    return { ...commonExtractorOpts };
}

export function getGoodPageExtractorOptions(): PageExtractorOptions {
    return { ...getGoodIdExtractorOptions() };
}

export function getGoodUserInfoExtractorOptions(): UserInfoExtractorOptions {
    return <UserInfoExtractorOptions>{};
}