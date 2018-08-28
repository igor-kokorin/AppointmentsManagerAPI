import * as passport from 'passport';
import { OAuth2Strategy, Profile, IOAuth2StrategyOption } from 'passport-google-oauth';
import { Request, Response, Application } from 'express';
import { FindOneQuery } from '../../queries';
import { UsersModel } from '../../mongodb';

export interface GoogleAuthBootstrapperOptions {
    app: Application;
    clientID: string;
    clientSecret: string;
}

export class GoogleAuthBootstrapper {
    public static bootstrapGoogleAuthStrategy(opts: GoogleAuthBootstrapperOptions) {
        let strategyOpts: IOAuth2StrategyOption = {
            clientID: opts.clientID,
            clientSecret: opts.clientSecret,
            callbackURL: '/auth/google/callback'
        };
        
        let verifyCallback = (accessToken: string, refreshToken: string, profile: Profile, done) => {

            done(null, profile);
        };
        
        let oauth2strategy = new OAuth2Strategy(strategyOpts, verifyCallback);
        
        passport.use(oauth2strategy);

        let googleCallback = (req: Request, res: Response) => {
            res.json();
        };

        opts.app.use(passport.initialize());
        opts.app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
        opts.app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleCallback);
    }
}