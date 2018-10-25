
import config from './config'
import Logic from './logic'
import ORM from './orm'
import Server from './server'

const server = new Server(config.port);
const logic = new Logic();
const orm = new ORM(config.mongoose);
