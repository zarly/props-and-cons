
import * as mongoose from 'mongoose'
import UserModel, {User} from './user'
import GroupModel, {Group} from './group'
import IdeaModel, {Idea, IdeaType} from './idea'

export default class ORM {
	private credentials: string;
	static User = UserModel;
	static Group = GroupModel;
	static Idea = IdeaModel;
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

	async getFreshIdeas (user: User) {
		// TODO: implement for mobile
	}

	async getIdeasList (user?: User, limit: number = 10, shift: number = 0) : Promise<{count: number, rows: Idea[]}> {
		return {
			count: 0,
			rows: [],
		};
	}
}
