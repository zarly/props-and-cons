
import config from '../../config'
import ORM from '../../orm'
import * as mongoose from 'mongoose'

export async function clearDatabase () {
	await ORM.User.deleteMany({});
	await ORM.Group.deleteMany({});
	await ORM.Idea.deleteMany({});
}

export async function registerRootIdeaWithChildren () {

}
