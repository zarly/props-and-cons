
import './declarations'
import config from '../config'
import {Express} from 'express-serve-static-core'
import * as passport from 'passport'
import * as vkAppStrategy from '../logic/passport-vk-app-sign'
import ORM from '../orm'

export default class Auth {
    app: Express;
	vk_app_sign: any;

    constructor (app: Express) {
    	this.app = app;

		passport.use('vk_app_sign', new vkAppStrategy.Strategy({
			secret: config.auth.vkapp.secret,
			disableVerification: config.auth.vkapp.disableVerification,
		}, async (uid: string, userInfo: any, done: Function) => {
			const user = await ORM.User.loginOrRegisterVk(uid, userInfo);
			done(null, user);
		}));

		this.vk_app_sign = passport.authenticate('vk_app_sign', { session: false });
    }
}
