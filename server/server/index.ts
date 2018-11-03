
import * as express from 'express'
import * as bodyParser from 'body-parser'
import {Express} from 'express-serve-static-core'
import ORM from '../orm'
import Logic from '../logic'
import Auth from './auth'
import ideaMock from '../mocks/idea'

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

        app.use('/api', bodyParser.json());

        app.get('/telemetry/healthcheck', (req, res) => {
            res.send({healthy: true});
        });

        app.get('/api/ping', (req, res) => {
            res.send({pong: true});
        });

		app.get('/api/ideas', async (req, res) => {
			// const ideas = await this.orm.getIdeasList();
			// res.send(ideas);
			res.send({
                rows: [{
                    _id: '1',
                    title: 'Idea 1',
                }, {
                    _id: '2',
                    title: 'Idea 2',
                }, {
                    _id: '3',
                    title: 'Idea 3',
                }],
                count: 25
            });
        });
        
		app.get('/api/ideas/:id', async (req, res) => {
			res.send(ideaMock);
        });
        
		app.post('/api/ideas', async (req, res) => {
			res.send({result: 'Idea created'});
		});
        
		app.patch('/api/ideas/:id', async (req, res) => {
			res.send({result: 'Idea edited'});
		});
        
		app.delete('/api/ideas/:id', async (req, res) => {
			res.send({result: 'Idea deleted'});
		});
        
		app.post('/api/vote', async (req, res) => {
			res.send({result: 'Voted'});
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
