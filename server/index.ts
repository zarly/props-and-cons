
import config from './config'
import Logic from './logic'
import orm from './orm'
import Server from './server'

const server = new Server(config.port);
const logic = new Logic();
