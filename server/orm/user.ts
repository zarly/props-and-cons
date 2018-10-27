
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

export class User extends Typegoose {
    _id: mongoose.Types.ObjectId;
}

const Model = new User().getModelForClass(User);

export default Model;
