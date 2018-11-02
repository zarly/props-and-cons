
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'
import fetch from 'cross-fetch'

const VK_APP_TOKEN = process.env.VK_APP_TOKEN;

export class User extends Typegoose {
    _id: mongoose.Types.ObjectId;

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
	vkInfo: object;

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
			const vkInfo = await getUserVkInfo(vkUid);

			instance = new Model({
				vkUid: `${vkUid}`,
				vkInfo: vkInfo
			});
			await instance.save();
		}

		return instance;
	}
}

interface vkUserInfo {
	id: number;
	first_name: string;
	last_name: string;
	deactivated?: string;
	verified: number;
	sex: number;
	photo_100: string;
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
