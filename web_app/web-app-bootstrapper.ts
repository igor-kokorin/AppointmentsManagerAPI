import * as express from 'express';
import * as expressJwt from 'express-jwt';

export interface WebAppBootstrapperOptions {
    webHostName: string;
    webPort: number;
    dbHostName: string;
    dbPort: string;
    googleClientId: string;
    googleClientSecret: string;
    jwtSecret: string;
}

export class WebAppBootstrapper {
    public static bootstrapWebApp(opts: WebAppBootstrapperOptions) {
        let app = express();
        
        app.use(express.json());

        app.get('/index', (req: Request, res: Response) => {
            if (!req.user) {
                res.set('Content-Type', 'text/html');
                res.end(`
                    <h1>${req.user.displayName}</h1>
                `);

                return;
            }
        });

        app.listen(opts.webPort, opts.webHostName);
    }
}