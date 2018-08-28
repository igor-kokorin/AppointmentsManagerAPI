import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
import { UserInfo } from '../index';

export class JwtTokenHelper {
    public static get AUDIENCE() {
        return 'http://appointments-manager-api/';
    }

    public static get ISSUER() {
        return 'http://appointments-manager-issuer/';
    }

    public static generateToken(opts: { user: UserInfo, jwtSecret: string }) {
        return jwt.sign(
            { userId: opts.user.opts.id, userName: opts.user.opts.name },
            opts.jwtSecret,
            { audience: this.AUDIENCE, expiresIn: '3d', issuer: this.ISSUER }
        );
    }

    public static getJwtCheckingMiddleware(opts: { jwtSecret: string }) {
        return expressJwt({
            audience: this.AUDIENCE,
            issuer: this.ISSUER,
            secret: opts.jwtSecret,
            resultProperty: 'token'
        });
    }
}