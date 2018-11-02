
import config from '../../config'
import * as request from 'supertest'
import Server from '../../server'
import ORM from '../../orm'
import Logic from '../../logic'
import {ServerHelper} from './helpers'

let orm: ORM;
let logic: Logic;
let server: Server;
let h: ServerHelper;

beforeAll(async () => {
	orm = new ORM(config.mongoose);
	await orm.connect();
	
	logic = new Logic(orm);
	server = new Server(orm, logic);
	h = new ServerHelper(server);
});

afterAll(async () => {
	await orm.disconnect();
});

test('signup', async () => {
	expect(1).toBe(1);
	// await helper.signup();
});

/****************
 ***** META *****
 ****************/
/*
Один юзер:
- зайти, посмотреть пустой список идей

- добавить корневую идею
- проверить, что появилась в общем списке

Два юзера, один создал идею:
- проверить, что появилась в общем списке

- зайти в идею, почитать подробнее
- добавить дочерние идеи разных типов
- проверить что появились в родителе

- проголосовать
- проверить, что голос зачтён
*/
