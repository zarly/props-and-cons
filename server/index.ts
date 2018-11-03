
import * as dotenv from 'dotenv'
import config from './config'
import Logic from './logic'
import ORM from './orm'
import Server from './server'

dotenv.config();

const orm = new ORM(config.mongoose);
const logic = new Logic(orm);
const server = new Server(orm, logic);

orm.connect();
server.listen(config.port);
