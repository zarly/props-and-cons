
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'
import * as crypto from 'crypto'

export class Session extends Typegoose {
    _id: mongoose.Types.ObjectId;
    
    @prop({unique: true})
	name: string;
    @prop()
    salt: string;
	
    @prop()
    realm: string;
    @prop()
	userId: mongoose.Types.ObjectId;
	
    @prop()
    referer: string;
    @prop()
    authMethod: string;
    @arrayProp({items: mongoose.Types.ObjectId})
	ips: Array<mongoose.Types.ObjectId>;

	@prop({required: true, 'default': Date.now})
	createdAt: number;

	@staticMethod
	static async createNew (realm: string, userId: mongoose.Types.ObjectId, referer: string, authMethod: string, ip: string) : Promise<Session> {
		const salt = `${Math.random().toFixed(15).substr(2)}-${userId}-${realm}-${referer}-${authMethod}-${ip}`;
		const name = `${authMethod}-${Date.now()}-${Math.random().toFixed(15).substr(2)}`;
		const sign = crypto.createHash('md5')
			.update(`${name}-${salt}`)
			.digest('hex');
		
		const instance = new Model({
			name: `${name}-${sign}`,
			salt,
			realm,
			userId,
			referer,
			authMethod,
			ips: [ip],
		});
		await instance.save();
		return instance;
	}
}

const Model = new Session().getModelForClass(Session);

export default Model;
