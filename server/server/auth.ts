
import './declarations'
import * as express from 'express'
import {Express} from 'express-serve-static-core'
import * as passport from 'passport'
import * as localStrategy from 'passport-local'
import * as customStrategy from 'passport-custom'
import * as crypto from 'crypto'

const VK_APP_SECRET: string = process.env.VK_APP_KEY;

export default class Auth {
    app: Express;

    constructor (app: Express) {
        passport.use(new localStrategy.Strategy(function(username: string, password: string, done: Function) {
            done(null, {me: true});
            // User.findOne({ username: username }, function (err, user) {
            //     if (err) { return done(err); }
            //     if (!user) { return done(null, false); }
            //     if (!user.verifyPassword(password)) { return done(null, false); }
            //     return done(null, user);
            // });
        }));

        function getUrlHash (urlString: string) : any {
            const url = new URL(urlString);
            const entries = [...url.searchParams.entries()];
            return entries.reduce((r: any, c: [string, string]) => {
                r[c[0]] = c[1];
                return r;
            }, {});
        }

        function checkAuthKey (params: any) {
            const str = `${params.api_id}_${params.viewer_id}_${VK_APP_SECRET}`;
            const sign = crypto.createHash('md5')
                .update(str)
                .digest('hex');
            return sign === params.auth_key;
        }

        passport.use('vk_app_md5', new customStrategy.Strategy(function(req: express.Request, done: Function) { // TODO: вынести в npm-пакет
            const vkUrl = req.get('referrer');
            const params = getUrlHash(vkUrl);
            
            const isAuth = checkAuthKey(params);
            if (isAuth) {
                const {viewer_id} = params;
                done(null, {vk_id: viewer_id}); // TODO: интегрировать с mongodb
            } else {
                done(null, false);
            }
        }));

        app.get('/api/auth/local', passport.authenticate('local', { session: false }), (req, res) => {
            res.send({auth: true});
        });

        app.get('/api/auth/vkapp', passport.authenticate('vk_app_md5', { session: false }), (req, res) => {
            res.send({auth: true, user: req.user});
        });
    }
}
