
import * as request from 'supertest'
import Server from '../../server'
import ORM from '../../orm'

test('GET /api/ideas', () => {
    const ormMock = <ORM>{};
    const server = new Server(ormMock);
    return request(server.app)
        .get('/api/ideas')
        .expect(200);
});
