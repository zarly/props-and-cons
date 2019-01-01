
import './declarations'
import config from '../config'
import {Express} from 'express-serve-static-core'
import * as passport from 'passport'
import * as vkAppStrategy from '../logic/passport-vk-app-sign'
import {Strategy as VkAppSignStrategy} from 'passport-vk-app-sign'
import ORM from '../orm'

interface IUser {
	id: number;
	first_name: string;
	last_name: string;
}

interface IGroup {
	id: number;
	is_closed: number;
	name: string;
	photo_50: string;
	photo_100: string;
	photo_200: string;
	screen_name: string;
	type: string;
}

interface IApiResult {
	response: [
		[IUser],
		[IGroup]
	];
}

function parseVkApiResult (apiResult: string) : {userInfo?: IUser, groupInfo?: IGroup} {
	try {
		const obj: IApiResult = JSON.parse(apiResult);
		const userInfo = obj.response[0][0] || null;
		const groupInfo = obj.response[1][0] || null;
		return {userInfo, groupInfo};
	} catch (e) {
		return {userInfo: null, groupInfo: null};
	}
}

export default class Auth {
    app: Express;
	vk_app_sign: any;
	vk_app: any;

    constructor (app: Express) {
		this.app = app;

		app.use(passport.initialize());
		app.use(passport.session());

		passport.use('vk_app_sign', new vkAppStrategy.Strategy({
			secret: config.auth.vkapp.secret,
			disableVerification: config.auth.vkapp.disableVerification,
		}, async (uid: string, rid: string, userInfo: any, done: Function) => {
			const user = await ORM.User.loginOrRegisterVk(uid, userInfo);
			const realm = await ORM.Group.findOrCreate(rid);
			done(null, user, realm);
		}));

		passport.use('vk_app', new VkAppSignStrategy({
			secret: config.auth.vkapp.secret,
			disableVerification: config.auth.vkapp.disableVerification,
		}, async (params: any, req: Express.Request, done: Function) => {

			const viewer_id = parseInt(params.viewer_id, 10);
			const user_id = parseInt(params.user_id, 10);
			const group_id = parseInt(params.group_id, 10);
			const api_id = parseInt(params.api_id, 10);

			const {userInfo, groupInfo} = parseVkApiResult(params.api_result);
			if (viewer_id && userInfo && userInfo.id !== viewer_id) {
				return done(new SyntaxError('[401] Wrong viewer info'));
			}
			if (group_id && groupInfo && groupInfo.id !== group_id) {
				return done(new SyntaxError('[401] Wrong group info'));
			}

			const realmApp = `${api_id}` || 'common';
			const realmOwner = (group_id && `g${group_id}`) || (user_id && `u${user_id}`) || 'common';
			const realmName = `vk:${realmApp}:${realmOwner}`;

			const user = await ORM.User.loginOrRegisterVk(`${viewer_id}`, userInfo);
			await ORM.Group.findOrCreate(realmName);
			done(null, user);
		}));

		this.vk_app_sign = passport.authenticate('vk_app_sign', { session: false });
		this.vk_app = passport.authenticate('vk_app', { session: false });
    }
}
