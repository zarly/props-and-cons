
import config from '../../config'
import ORM from '../../orm'
import * as mongoose from 'mongoose'

export async function dropDatabase () {
	await mongoose.connection.db.dropDatabase();
}

export async function registerRootIdeaWithChildren () {

}
