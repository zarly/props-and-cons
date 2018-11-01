
import * as request from 'supertest'
import Server from '../../server'
import ORM from '../../orm'
import Logic from '../../logic'

test('404', () => {
    const ormMock = <ORM>{};
    const logic = new Logic(ormMock);
    const server = new Server(ormMock, logic);
    return request(server.app)
        .get('/api/unexisting-page')
        .expect(404);
});

test('telemetry healthcheck', async () => {
    const ormMock = <ORM>{};
	const logic = new Logic(ormMock);
    const server = new Server(ormMock, logic);
    const response = await request(server.app)
        .get('/telemetry/healthcheck')
        .expect(200);
	expect(response.body).toEqual({healthy: true});
});

test('ping', async () => {
    const ormMock = <ORM>{};
	const logic = new Logic(ormMock);
    const server = new Server(ormMock, logic);
	const response = await request(server.app)
        .get('/api/ping')
        .expect(200);
	expect(response.body).toEqual({pong: true});
});

// TODO: тесты на сам механизм сервера, без ORM
