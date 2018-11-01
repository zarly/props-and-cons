
import './declarations'
import * as express from 'express'
import {Express} from 'express-serve-static-core'
import * as passport from 'passport'
import * as customStrategy from 'passport-custom'
import * as crypto from 'crypto'
import ORM from '../orm'

const VK_APP_SECRET: string = process.env.VK_APP_SECRET;

export default class Auth {
    app: Express;
    vk_app_md5: any;

    constructor (app: Express) {
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

        passport.use('vk_app_md5', new customStrategy.Strategy(async (req: express.Request, done: Function) => { // TODO: вынести в npm-пакет
            const vkUrl = req.get('referrer');
            const params = getUrlHash(vkUrl);
            
            const isAuth = checkAuthKey(params);
            if (isAuth) {
                const {viewer_id, access_token} = params;
				const user = await ORM.User.loginOrRegisterVk(viewer_id, access_token);
                done(null, user);
            } else {
                done(null, false);
            }
        }));

        this.vk_app_md5 = passport.authenticate('vk_app_md5', { session: false });

        app.get('/api/auth/vkapp', this.vk_app_md5, (req, res) => {
            res.send({auth: true, user: req.user});
        });
    }
}
