import * as jwt from 'jsonwebtoken';

export default class TestUserGenerator {
    public static get TEST_JWT_SECRET() {
        return 'TEST_SECRET';
    }

    public static getValidApiToken(): string {

        return jwt.sign(
            { userId: 'test_user' },
            TestUserGenerator.TEST_JWT_SECRET,
            { audience: 'http://appointments-manager-api/', expiresIn: 1800000, issuer: 'http://appointments-manager-issuer/' }
        );
    }
}