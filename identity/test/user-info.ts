import { ObjectCreatorTesterFactory } from '../../utilities';
import { UserInfo } from '../index';
import { getGoodUserInfoOptions } from './helpers/get-good-options';

describe('UserInfo', function () {
    ObjectCreatorTesterFactory(UserInfo, getGoodUserInfoOptions()).isCreatedSuccessfully();

    describe('creating UserInfo when', function () {
        ObjectCreatorTesterFactory(UserInfo, getGoodUserInfoOptions(), 'id').isAbsent().isEmpty().isNotAString();
        ObjectCreatorTesterFactory(UserInfo, getGoodUserInfoOptions(), 'name').isAbsent().isEmpty().isNotAString();
    });
});