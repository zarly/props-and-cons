
import config from '../../config'
import * as request from 'supertest'
import Server from '../../server'
import ORM from '../../orm'
import Logic from '../../logic'

let orm: ORM;
let logic: Logic;
let server: Server;

beforeAll(async () => {
	orm = new ORM(config.mongoose);
	logic = new Logic(orm);
	await orm.connect();
    server = new Server(orm, logic);
});

afterAll(async () => {
	await orm.disconnect();
});

test('GET /api/ideas', async () => {
    const response = await request(server.app)
        .get('/api/ideas')
        .expect(200);
	expect(response.body).toBeDefined();
	expect(response.body.count).toBe(0);
	expect(response.body.rows).toEqual([]);
});
