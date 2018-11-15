
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'
import fetch from 'cross-fetch'
import {VoteType} from './idea'

type ObjectId = mongoose.Types.ObjectId;
const VK_APP_TOKEN = process.env.VK_APP_TOKEN;

type MongoId = string | ObjectId;

interface vkUserInfo {
	id: number;
	first_name: string;
	last_name: string;
	deactivated?: string;
	verified: number;
	sex: number;
	photo_100: string;
}

interface AuthorInfo {
	_id: string | ObjectId;
	name: string;
	vkUid: string;
}

export class User extends Typegoose {
    _id: ObjectId;

    @prop({ index: true })
    login: string;
    @prop()
    name: string;
    @prop()
    passwordHash: string;
    @arrayProp({ items: String })
    roles: Array<string>;
    @prop()
    salt: string;
    @prop()
    isBanned: boolean;

	@prop({ index: true })
	vkUid: string;
	@prop()
	vkInfo: any;

    @prop()
    invitedBy: mongoose.Types.ObjectId;
    @prop()
    homeGroup: mongoose.Types.ObjectId;

    @arrayProp({items: mongoose.Types.ObjectId})
    votes: Array<mongoose.Types.ObjectId>;
    @arrayProp({items: mongoose.Types.ObjectId})
    views: Array<mongoose.Types.ObjectId>;
    @arrayProp({items: mongoose.Types.ObjectId})
    ownIdeas: Array<mongoose.Types.ObjectId>;

    @arrayProp({items: mongoose.Types.ObjectId})
    friends: Array<mongoose.Types.ObjectId>;
    @arrayProp({items: mongoose.Types.ObjectId})
    similarUsers: Array<mongoose.Types.ObjectId>;

	@staticMethod
	static async loginOrRegisterVk (vkUid: string, params?: any) : Promise<any> {
		let instance: any|null = await Model.findOne({vkUid: `${vkUid}`});

		if (!instance) {
			// const vkInfo = await getUserVkInfo(vkUid); // TODO: сделать через первый запрос к API

			instance = new Model({
				vkUid: `${vkUid}`,
				// vkInfo: vkInfo,
			});
			await instance.save();
		}

		return instance;
	}

	@staticMethod
	static async vote (ideaId: ObjectId, userId: ObjectId, voteType: VoteType) {
		return new Promise((resolve, reject) => {
			Model.updateOne({
				_id: userId
			}, {
				$push: {
					votes: {ideaId, voteType}
				}
			}, (err: any, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	}

	@staticMethod
	static async publicInfo (id: MongoId) : Promise<AuthorInfo> {
		const user = await Model.findById(id, {name: true, vkInfo: true, vkUid: true});
		return {
			_id: user._id,
			name: user.name || (user.vkInfo && (user.vkInfo.first_name + ' ' + user.vkInfo.last_name)) || 'noname',
			vkUid: user.vkUid,
		};
	}

	@instanceMethod
	async getVoteForIdea (id: MongoId) {
		return 1;
	}
}

async function getUserVkInfo (vkUid: string) : Promise<vkUserInfo|any> {
	let url = new URL('https://api.vk.com/method/users.get');
	url.searchParams.append('user_ids', vkUid);
	url.searchParams.append('fields', 'verified,sex,photo_100');
	url.searchParams.append('access_token', VK_APP_TOKEN);
	url.searchParams.append('v', '5.87');

	const response = await fetch(url.toString());
	const vkInfo = await response.json();

	if (!vkInfo.response) {
		console.error(`Wrong response from VK`, vkInfo, url.toString());
	}

	return vkInfo.response[0];
}

const Model = new User().getModelForClass(User);

export default Model;
