
import * as express from 'express'
import {Express} from 'express-serve-static-core'
import ORM from '../orm'

export default class Server {
    app: Express;
    orm: ORM;

    constructor (orm: ORM) {
        this.orm = orm;
        const app = this.app = express();

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
    }

    listen (port?: number) {
        this.app.listen(port);
    }
}
