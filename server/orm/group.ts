
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

export class Group extends Typegoose {
    _id: mongoose.Types.ObjectId;
    
    @prop({unique: true})
    realm: string;
    @prop()
    externalId: string;
    @prop()
    name: string;

    @prop()
    owner: mongoose.Types.ObjectId;
    @arrayProp({items: mongoose.Types.ObjectId})
    admins: Array<mongoose.Types.ObjectId>;

	@prop({required: true, 'default': Date.now})
	createdAt: number;

	@staticMethod
	static async findOrCreate (realm: string) : Promise<any> {
		let instance: any|null = await Model.findOne({realm});

		if (!instance) {
			instance = new Model({
				realm,
			});
			await instance.save();
		}

		return instance;
	}
}

const Model = new Group().getModelForClass(Group);

export default Model;
