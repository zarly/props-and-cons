
import * as express from 'express'
import {Express} from "express-serve-static-core"

export default class Server {
    app: Express;

    constructor (port?: number) {
        const app = this.app = express();

        app.get('/ping', (req, res) => {
            res.send({pong: true});
        });

        if (port) app.listen(port);
    }
}
