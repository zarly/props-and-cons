
import * as express from 'express'

export default class Server {
    constructor (port: number) {
        const app = express();

        app.listen(port);
    }
}
