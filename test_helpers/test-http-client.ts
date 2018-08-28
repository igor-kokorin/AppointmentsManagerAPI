import * as supertest from 'supertest';
import { Request } from 'superagent';
import TestUserGenerator from './test-user-generator';
import createExpressApp from '../index';

export interface RequestOptions {
    authorized?: boolean;
    body?: any;
    id?: string;
    path: string;
}

export class TestHttpClient {
    public static _authorizeRequest(request: Request): Request {
        let testUserToken = TestUserGenerator.getValidApiToken();
        return request.set('Authorization', `Bearer ${testUserToken}`);
    }

    private static _get(test: supertest.SuperTest<supertest.Test>, options: RequestOptions) {
        return test.get(`${options.path}${options.id ? `/${options.id}` : '' }`)
    }

    private static _post(test: supertest.SuperTest<supertest.Test>, options: RequestOptions) {
        return test
            .post(options.path)
            .send(options.body)
            .type('application/json');
    }

    private static _put(test: supertest.SuperTest<supertest.Test>, options: RequestOptions) {
        return test
            .put(`${options.path}${options.id ? `/${options.id}` : '' }`)
            .send(options.body)
            .type('application/json');
    }
    
    private static _delete(test: supertest.SuperTest<supertest.Test>, options: RequestOptions) {
        return test
            .delete(`${options.path}${options.id ? `/${options.id}` : '' }`);
    }

    private static _common(methodFn: (test: supertest.SuperTest<supertest.Test>, options: RequestOptions) => Request, options: RequestOptions): Request {
        let request: Request,
            app = createExpressApp(TestUserGenerator.TEST_JWT_SECRET);
        
        request = methodFn(supertest(app), options)
            .accept('application/json');
        
        if (options.authorized) {
            return this._authorizeRequest(request);
        }

        return request;
    }

    public static get(options: RequestOptions): Request {
        return this._common(TestHttpClient._get, options);
    }

    public static post(options: RequestOptions): Request {
        return this._common(TestHttpClient._post, options);
    }

    public static put(options: RequestOptions): Request {
        return this._common(TestHttpClient._put, options);
    }

    public static delete(options: RequestOptions): Request {
        return this._common(TestHttpClient._delete, options);
    }
}