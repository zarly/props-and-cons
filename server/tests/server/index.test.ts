
import * as request from 'supertest'
import Server from '../../server'

test('404', () => {
    const server = new Server();
    return request(server.app)
        .get('/api/unexisting-page')
        .expect(404);
});

test('telemetry healthcheck', () => {
    const server = new Server();
    return request(server.app)
        .get('/telemetry/healthcheck')
        .expect(200)
        .then(response => {
            expect(response.body).toEqual({pong: true});
        });
});

test('ping', () => {
    const server = new Server();
    return request(server.app)
        .get('/api/ping')
        .expect(200)
        .then(response => {
            expect(response.body).toEqual({pong: true});
        });
});
