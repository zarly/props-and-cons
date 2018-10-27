
import config from '../../config'
import ORM from '../../orm'
import * as mongoose from 'mongoose'

export async function clearDatabase () {
	await ORM.Idea.remove({});
	// await mongoose.connection.db.dropDatabase();
}

export async function registerRootIdeaWithChildren () {

}
