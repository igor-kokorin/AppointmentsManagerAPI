import { ObjectCreatorTesterFactory } from '../../utilities';
import { UserInfoExtractor, RequestExtractor } from '../index';
import { getGoodUserInfoExtractorOptions } from './helpers';
import { assert } from 'chai';

describe('UserInfoExtractor', function () {
    ObjectCreatorTesterFactory(UserInfoExtractor).inheritsFrom(RequestExtractor);
    ObjectCreatorTesterFactory(UserInfoExtractor, getGoodUserInfoExtractorOptions()).isCreatedSuccessfully();

    describe('creating UserInfoExtractor when', function () {
        ObjectCreatorTesterFactory(UserInfoExtractor, getGoodUserInfoExtractorOptions(), 'request.token').isAbsent().isNotAnObject().isEmpty();
    });
});
