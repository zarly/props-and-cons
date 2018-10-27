
import * as express from 'express'
import {Express} from 'express-serve-static-core'
import api from './api'

export default class Server {
    app: Express;

    constructor () {
        const app = this.app = express();

        app.get('/telemetry/healthcheck', (req, res) => {
            res.send({pong: true});
        });

        app.use('/api', api);
    }

    listen (port?: number) {
        this.app.listen(port);
    }
}
