
import {Strategy as BaseStrategy} from 'passport-strategy'
import {Request} from  'express'
import * as crypto from 'crypto'

const VK_APP_SECRET: string = process.env.VK_APP_SECRET;

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

export class Strategy extends BaseStrategy {
	name: string;
	private done: Function;

	constructor (done: Function) {
		super();
		this.name = 'vk_app_auth_key';
		this.done = done;
	}

	authenticate (req: Request, options?: any): void {
		const vkUrl = req.get('referrer');
		const params = getUrlHash(vkUrl);

		const isAuth = checkAuthKey(params);
		if (isAuth) {
			const {viewer_id} = params;
			this.done(viewer_id, params, (error: any, user: any) => {
				this.success(user);
			});
		} else {
			this.fail(401);
		}
	}
}
