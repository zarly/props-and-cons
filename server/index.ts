
import config from './config'
import Logic from './logic'
import ORM from './orm'
import Server from './server'

const logic = new Logic();
const orm = new ORM(config.mongoose);
const server = new Server();

server.listen(config.port);
