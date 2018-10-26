
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'
import Idea from './idea'

export default class ORM {
	private credentials: string;
	static Idea = Idea;

	constructor (credentials: string) {
		this.credentials = credentials;
	}

	async connect () {
		return await mongoose.connect(this.credentials);
	}

	static addChildIdea (parentId: mongoose.Types.ObjectId, idea: any) {
		return new Promise((resolve, reject) => {
			Idea.collection.update({
				_id: parentId
			}, {
				$push: {
					comments: idea._id
				}
			}, (err, res) => {
				if (err) reject(err);
				resolve(res.result);
			});
		});
	}
}
