import { CommonBaseType, PropertyCheckerFactory } from '../../utilities';

export interface UserInfoOptions {
    id: string;
    name: string;
}

export class UserInfo extends CommonBaseType<UserInfoOptions> {
    constructor(opts: UserInfoOptions) {
        super(opts);

        PropertyCheckerFactory(this.opts, 'id').isPresent().isString().isNotEmpty();
        PropertyCheckerFactory(this.opts, 'name').isPresent().isString().isNotEmpty();
    }
}