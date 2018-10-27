
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

export class Group extends Typegoose {
    _id: mongoose.Types.ObjectId;
}

const Model = new Group().getModelForClass(Group);

export default Model;
