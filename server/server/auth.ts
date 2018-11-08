
import './declarations'
import config from '../config'
import {Express} from 'express-serve-static-core'
import * as passport from 'passport'
import * as vkAppAuthKeyStrategy from '../logic/passport-vk-app-auth-key'
import ORM from '../orm'

export default class Auth {
    app: Express;
	vk_app_auth_key: any;

    constructor (app: Express) {
    	this.app = app;

		passport.use('vk_app_auth_key', new vkAppAuthKeyStrategy.Strategy({
			secret: config.auth.vkapp.secret,
			disableVerification: config.auth.vkapp.disableVerification,
		}, async (uid: string, params: any, done: Function) => {
			const user = await ORM.User.loginOrRegisterVk(uid, params);
			done(null, user);
		}));

		this.vk_app_auth_key = passport.authenticate('vk_app_auth_key', { session: false });

		app.get('/api/auth/vkapp', this.vk_app_auth_key, (req, res) => {
			res.send({auth: true, user: req.user});
		});
    }
}
