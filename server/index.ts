
import config from './config'
import logic from './logic'
import orm from './orm'
import Server from './server'

const server = new Server(config.port);
