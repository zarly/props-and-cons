
import * as request from 'supertest'
import Server from '../../server'

export class ServerHelper {
	server: Server;

	constructor (server: Server) {
		this.server = server;
	}

	async signup () {}

	async signin () {}

	async signout () {}

	async restorePassword () {}

	async me () {}


	async getRootIdeasList () {}

	async getIdeaDetails () {}

	async getChildIdeasList () {}

	async addRootIdea () {}

	async addChildIdea () {}

	async vote () {}
}
