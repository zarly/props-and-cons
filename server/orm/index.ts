
import * as mongoose from 'mongoose'
import UserModel, {User} from './user'
import GroupModel, {Group} from './group'
import IdeaModel, {Idea, IdeaType} from './idea'
import chalk from 'chalk'

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

export const ObjectId = mongoose.Types.ObjectId;

export default class ORM {
	private credentials: string;
	static User = UserModel;
	static Group = GroupModel;
	static Idea = IdeaModel;
	static IdeaTypes = IdeaType;

	constructor (credentials: string) {
		this.credentials = credentials;

		process.on('SIGINT', function(){
			mongoose.connection.close(function(){
				console.log(termination("Mongoose default connection is disconnected due to application termination"));
				process.exit(0);
			});
		});
	}

	async connect () {
		return await mongoose.connect(this.credentials, {
			keepAlive: 300000,
			reconnectTries: 3,
			useNewUrlParser: true
		});

		mongoose.connection.on('connected', function(){
			console.log(connected("Mongoose default connection is open to ", this.credentials));
		});
	
		mongoose.connection.on('error', function(err){
			console.log(error("Mongoose default connection has occured "+err+" error"));
		});
	
		mongoose.connection.on('disconnected', function(){
			console.log(disconnected("Mongoose default connection is disconnected"));
		});
	}

	async disconnect () {
		await mongoose.connection.close();
	}
}
