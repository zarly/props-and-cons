
import * as request from 'supertest'
import Server from '../../server'
import ORM from '../../orm'

test('404', () => {
    const ormMock = <ORM>{};
    const server = new Server(ormMock);
    return request(server.app)
        .get('/api/unexisting-page')
        .expect(404);
});

test('telemetry healthcheck', () => {
    const ormMock = <ORM>{};
    const server = new Server(ormMock);
    return request(server.app)
        .get('/telemetry/healthcheck')
        .expect(200)
        .then(response => {
            expect(response.body).toEqual({healthy: true});
        });
});

test('ping', () => {
    const ormMock = <ORM>{};
    const server = new Server(ormMock);
    return request(server.app)
        .get('/api/ping')
        .expect(200)
        .then(response => {
            expect(response.body).toEqual({pong: true});
        });
});
