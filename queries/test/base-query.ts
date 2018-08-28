import { ObjectCreatorTesterFactory } from '../../utilities';
import { getGoodQueryBaseOptions } from './helpers'
import { QueryBase } from '../index';
import { UserInfo } from '../../identity';

describe('QueryBase', function () {
    ObjectCreatorTesterFactory(QueryBase, getGoodQueryBaseOptions()).isCreatedSuccessfully();

    describe('creating QueryBase when', function () {
        ObjectCreatorTesterFactory(QueryBase, getGoodQueryBaseOptions(), 'dbHandle').isAbsent();
    });
});