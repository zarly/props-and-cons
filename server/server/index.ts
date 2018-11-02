
import * as express from 'express'
import {Express} from 'express-serve-static-core'
import ORM from '../orm'
import Logic from '../logic'
import Auth from './auth'

export default class Server {
    app: Express;
    orm: ORM;
    logic: Logic;
    auth: Auth;

    constructor (orm: ORM, logic: Logic) {
        this.orm = orm;
        this.logic = logic;
        const app = this.app = express();
        this.auth = new Auth(app);

        app.get('/telemetry/healthcheck', (req, res) => {
            res.send({healthy: true});
        });

        app.get('/api/ping', (req, res) => {
            res.send({pong: true});
        });

		app.get('/api/ideas', async (req, res) => {
			const ideas = await this.orm.getIdeasList();
			res.send(ideas);
		});

		app.get('/api/users/me', this.auth.vk_app_auth_key, async (req, res) => {
			res.send(req.user);
		});
    }

    listen (port?: number) {
        this.app.listen(port);
        console.log(`Start listening at port ${port}`);
    }
}
