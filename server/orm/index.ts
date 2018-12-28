
import * as mongoose from 'mongoose'
import UserModel, {User} from './user'
import GroupModel, {Group} from './group'
import IdeaModel, {Idea} from './idea'
import SessionModel, {Session} from './session'
import {RootIdeaType, IdeaType, VoteType} from './_enums'
import chalk from 'chalk'

const connected = chalk.cyan;
const error = chalk.yellow;
const disconnected = chalk.red;
const termination = chalk.magenta;

export {RootIdeaType, IdeaType, VoteType} from './_enums'
export const ObjectId = mongoose.Types.ObjectId;
export type MongoIdType = string | mongoose.Types.ObjectId;

export default class ORM {
	private credentials: string;
	private verbose: boolean;
	private reconnect: boolean;
	static Session = SessionModel;
	static User = UserModel;
	static Group = GroupModel;
	static Idea = IdeaModel;
	static RootIdeaType = RootIdeaType;
	static IdeaType = IdeaType;
	static VoteType = VoteType;

	constructor (credentials: string, verbose: boolean = false) {
		this.credentials = credentials;
		this.verbose = verbose;
		this.reconnect = true;

		process.on('SIGINT', () => {
			this.reconnect = false;
			mongoose.connection.close(() => {
				if (this.verbose) console.log(termination('Mongoose default connection is disconnected due to application termination'));
				process.exit(0);
			});
		});

		mongoose.connection.on('connected', () => {
			if (this.verbose) console.log(connected('Mongoose default connection is open to', this.credentials));
		});

		mongoose.connection.on('error', (err) => {
			if (this.verbose) console.log(error(`Mongoose default connection has occured ${err} error`));
		});

		mongoose.connection.on('disconnected', async () => {
			if (this.verbose) console.log(disconnected('Mongoose default connection is disconnected'));

			if (this.reconnect) {
				await this.connect();
			}
		});
	}

	async connect () {
		mongoose.set('useCreateIndex', true); // https://github.com/Automattic/mongoose/issues/6890
		const connectPromise = mongoose.connect(this.credentials, {
			keepAlive: 300000,
			reconnectTries: 3,
			useNewUrlParser: true,
		});
		return await connectPromise;
	}

	async disconnect () {
		this.reconnect = false;
		await mongoose.connection.close();
	}
}
