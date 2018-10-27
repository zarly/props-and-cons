
import * as mongoose from 'mongoose'
import Idea, {IdeaType} from './idea'

export default class ORM {
	private credentials: string;
	static Idea = Idea;
	static IdeaTypes = IdeaType;

	constructor (credentials: string) {
		this.credentials = credentials;
	}

	async connect () {
		return await mongoose.connect(this.credentials, {useNewUrlParser: true});
	}

	async disconnect () {
		await mongoose.connection.close();
	}
}
