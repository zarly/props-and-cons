
import config from './config'
import Logic from './logic'
import ORM from './orm'
import Server from './server'

const orm = new ORM(config.mongoose);
const logic = new Logic(orm);
const server = new Server(orm, logic);

server.listen(config.port);
