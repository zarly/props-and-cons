
import * as request from 'supertest'
import Server from '../../server'

test('GET /api/ideas', () => {
    const server = new Server();
    return request(server.app)
        .get('/api/ideas')
        .expect(200);
});
