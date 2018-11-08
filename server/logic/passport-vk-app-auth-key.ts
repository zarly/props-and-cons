
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
		const params = Strategy.getUrlHash(vkUrl);

		const isAuth = this.disableVerification || this.verifyAuthKey(params);
		if (isAuth) {
			const {viewer_id} = params;
			this.done(viewer_id, params, (error: any, user: any) => {
				this.success(user);
			});
		} else {
			this.fail(401);
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

	protected verifyAuthKey (params: any) {
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
