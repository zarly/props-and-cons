
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

		app.get('/api/ideas', this.auth.vk_app_auth_key, async (req, res) => {
			const ideas = await this.logic.getIdeasList(req.user);
			res.send(ideas);
        });
        
		app.get('/api/ideas/:id', this.auth.vk_app_auth_key, async (req, res) => {
            const result = await this.logic.getIdeaById(req.params.id);
            res.send(result);
        });
        
		app.post('/api/ideas', this.auth.vk_app_auth_key, async (req, res) => {
            const result = await this.logic.publishIdea(req.user, req.body);
			res.send(result);
		});
        
		app.patch('/api/ideas/:id', this.auth.vk_app_auth_key, async (req, res) => {
			res.send({result: 'Idea edited'});
		});
        
		app.delete('/api/ideas/:id', this.auth.vk_app_auth_key, async (req, res) => {
			res.send({result: 'Idea deleted'});
		});
        
		app.post('/api/vote', this.auth.vk_app_auth_key, async (req, res) => {
            const result = await this.logic.vote(req.user, req.body.ideaId, req.body.voteType);
            console.log('result', result);
			res.send(result);
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
