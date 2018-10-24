
import * as request from 'supertest'
import Server from '../../server'

test('404', () => {
    const server = new Server();
    return request(server.app)
        .get('/unexisting-page')
        .expect(404);
});

test('ping', () => {
    const server = new Server();
    return request(server.app)
        .get('/ping')
        .expect(200)
        .then(response => {
            expect(response.body).toEqual({pong: true});
        });
});
