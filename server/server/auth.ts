
import './declarations'
import {Express} from 'express-serve-static-core'
import * as passport from 'passport'
import * as vkAppAuthKeyStrategy from '../logic/passport-vk-app-auth-key'
import ORM from '../orm'

export default class Auth {
    app: Express;
	vk_app_auth_key: any;

    constructor (app: Express) {
		passport.use('vk_app_auth_key', new vkAppAuthKeyStrategy.Strategy(async (uid: string, params: any, done: Function) => {
			const user = await ORM.User.loginOrRegisterVk(uid, params.access_token);
			done(null, user);
		}));

		this.vk_app_auth_key = passport.authenticate('vk_app_auth_key', { session: false });

		app.get('/api/auth/vkapp', this.vk_app_auth_key, (req, res) => {
			res.send({auth: true, user: req.user});
		});
    }
}
