
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

export class Group extends Typegoose {
    _id: mongoose.Types.ObjectId;
    
    @prop()
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
}

const Model = new Group().getModelForClass(Group);

export default Model;
