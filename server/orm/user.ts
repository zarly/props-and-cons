
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

export class User extends Typegoose {
    _id: mongoose.Types.ObjectId;

    @prop()
    login: string;
    @prop()
    name: string;
    @prop()
    passwordHash: string;
    @arrayProp({items: String})
    roles: Array<string>;
    @prop()
    salt: string;
    @prop()
    isBanned: boolean;

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
}

const Model = new User().getModelForClass(User);

export default Model;
