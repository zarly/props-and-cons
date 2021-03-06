/*
Первый запрос к API ВКонтакте:
method=execute&code=var viewer = API.users.get({user_ids: [{viewer_id}], fields: "sex,photo_100"});var group = API.groups.getById({group_ids: [{group_id}]});return [viewer,group];&format=json&v=5.27
 */

import {Strategy as BaseStrategy} from 'passport-strategy'
import {Request} from  'express'
import * as crypto from 'crypto'

interface IStrategyOptions {
	secret?: string;
	disableVerification?: boolean;
	verbose?: boolean;
	logFunction?: Function;
	name?: string;
}

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

export class Strategy extends BaseStrategy {
	static readonly DEFAULT_NAME = 'vk_app_auth_key';

	readonly name: string;
	protected done: Function;
	protected secret?: string;
	protected disableVerification: boolean;
	protected verbose: boolean;
	protected logFunction: Function;

	constructor (options: IStrategyOptions = {}, done: Function) {
		super();
		this.name = options.name || Strategy.DEFAULT_NAME;
		this.secret = options.secret;
		this.disableVerification = options.disableVerification;
		this.verbose = options.verbose;
		this.logFunction = options.logFunction || console.log.bind(console);
		this.done = done;
	}

	authenticate (req: Request, options?: any): void {
		const vkUrl = req.get('referrer');
		const params = vkUrl ? Strategy.getUrlHash(vkUrl) : {};

		const isAuth = this.disableVerification || this.verifyAuthKey(params);
		if (isAuth) {
			const {viewer_id} = params;
			const {userInfo, groupInfo} = Strategy.parseApiResult(params.api_result);
			this.done(viewer_id, userInfo, (error: any, user: any) => {
				(req as any).vkParams = params;
				(req as any).vkUserInfo = userInfo;
				(req as any).vkGroupInfo = groupInfo;
				(req as any).realm = `vk:${params.group_id}`;
				this.success(user);
			});
		} else {
			this.fail(401);
		}
	}

	static parseApiResult (apiResult: string) : {userInfo?: IUser, groupInfo?: IGroup} {
		try {
			const obj: IApiResult = JSON.parse(apiResult);
			const userInfo = obj.response[0][0] || null;
			const groupInfo = obj.response[1][0] || null;
			return {userInfo, groupInfo};
		} catch (e) {
			return {userInfo: null, groupInfo: null};
		}
	}

	static getUrlHash (urlString: string) : any {
		const url = new URL(urlString);
		const entries = [...url.searchParams.entries()];
		return entries.reduce((r: any, c: [string, string]) => {
			r[c[0]] = c[1];
			return r;
		}, {});
	}

	verifyAuthKey (params: any) {
		const str = `${params.api_id}_${params.viewer_id}_${this.secret}`;
		const sign = crypto.createHash('md5')
			.update(str)
			.digest('hex');

		if (this.verbose) {
			this.logFunction('Verify authKey:', str, sign, params.auth_key);
		}

		return sign === params.auth_key;
	}
}
