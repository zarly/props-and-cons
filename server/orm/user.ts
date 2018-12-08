
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'
import fetch from 'cross-fetch'
import {VoteType} from './_enums'

type ObjectId = mongoose.Types.ObjectId;
const VK_APP_TOKEN = process.env.VK_APP_TOKEN;

type MongoIdType = string | ObjectId;

interface vkUserInfo {
	id: number;
	first_name: string;
	last_name: string;
	deactivated?: string;
	verified: number;
	sex: number;
	photo_100: string;
}

export class AuthorInfo {
	_id: string | ObjectId;
	name: string;
	photo?: string;
	vkUid: string;
}

export class User extends Typegoose {
    _id: ObjectId;

	role: number; // заполняется из NodeJS passport-vk-app-sign

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

    @arrayProp({items: Object})
    votes: Array<{ideaId: ObjectId, voteType: VoteType}>;
    @arrayProp({items: mongoose.Types.ObjectId})
    views: Array<mongoose.Types.ObjectId>;
    @arrayProp({items: mongoose.Types.ObjectId})
    ownIdeas: Array<mongoose.Types.ObjectId>;

    @arrayProp({items: mongoose.Types.ObjectId})
    friends: Array<mongoose.Types.ObjectId>;
    @arrayProp({items: mongoose.Types.ObjectId})
    similarUsers: Array<mongoose.Types.ObjectId>;

	@prop({required: true, 'default': Date.now})
	createdAt: number;

	@staticMethod
	static async loginOrRegisterVk (vkUid: string, userInfo?: any) : Promise<any> {
		let instance: any|null = await Model.findOne({vkUid: `${vkUid}`});

		if (!instance) {
			instance = new Model({
				vkUid: `${vkUid}`,
				vkInfo: userInfo,
			});
			await instance.save();
		}

		return instance;
	}

	@staticMethod
	static async vote (userId: MongoIdType, ideaId: MongoIdType, voteType: VoteType) {
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

	@instanceMethod
	getAuthorInfo () : AuthorInfo {
		return {
			_id: this._id,
			name: this.name || (this.vkInfo && (this.vkInfo.first_name + ' ' + this.vkInfo.last_name)) || 'noname',
			photo: (this.vkInfo && this.vkInfo.photo_100) || null,
			vkUid: this.vkUid,
		};
	}

	@staticMethod
	static async publicInfo (id: MongoIdType) : Promise<AuthorInfo> {
		const user = await Model.findById(id, {name: true, vkInfo: true, vkUid: true});
		return user.getAuthorInfo();
	}
}

const Model = new User().getModelForClass(User);

export default Model;
