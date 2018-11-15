
import chalk from 'chalk'
import * as dotenv from 'dotenv'
import config from './config'
import Logic from './logic'
import ORM from './orm'
import Server from './server'

if (parseInt(process.version.slice(1)) < 10) {
	console.log(chalk.red('Required NodeJS 10 or later'));
	process.exit(1);
}

console.log(`environment = ${config.environment}`);
dotenv.config();

const orm = new ORM(config.mongoose);
const logic = new Logic(orm);
const server = new Server(orm, logic);

orm.connect();
server.listen(config.port);
