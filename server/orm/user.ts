
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

export class User extends Typegoose {
    _id: mongoose.Types.ObjectId;

    @prop({ unique: true })
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

	@prop({ unique: true })
	vk_uid: string;

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
	static async loginOrRegisterVk (vk_uid: string) : Promise<any> {
		let instance: any|null = await Model.findOne({vk_uid: `${vk_uid}`});

		if (!instance) {
			instance = new Model({
				vk_uid: `${vk_uid}`
			});
			await instance.save();
		}

		return instance;
	}
}

const Model = new User().getModelForClass(User);

export default Model;
