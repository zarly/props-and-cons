
import config from '../../config'
import * as request from 'supertest'
import Server from '../../server'
import ORM from '../../orm'

let orm: ORM;
let server: Server;

beforeAll(async () => {
	orm = new ORM(config.mongoose);
	await orm.connect();
    server = new Server(orm);
});

afterAll(async () => {
	await orm.disconnect();
});

test('GET /api/ideas', () => {
    return request(server.app)
        .get('/api/ideas')
        .expect(200)
        .then(response => {
            expect(response.body).toBeDefined();
            expect(response.body.count).toBe(0);
            expect(response.body.rows).toEqual([]);
        });
});
