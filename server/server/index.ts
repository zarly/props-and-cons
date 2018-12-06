
import * as express from 'express'
import * as bodyParser from 'body-parser'
import {Express} from 'express-serve-static-core'
import * as morgan from 'morgan'
import config from '../config'
import ORM from '../orm'
import Logic from '../logic'
import Auth from './auth'
import chalk from 'chalk'
import ideaMock from '../mocks/idea'
import {unescape} from 'querystring';

const connected = chalk.cyan;

// TODO: CORS на POST

export default class Server {
    app: Express;
    orm: ORM;
    logic: Logic;
    auth: Auth;

    constructor (orm: ORM, logic: Logic) {
		this.orm = orm;
		this.logic = logic;
		this.app = express();
		this.auth = new Auth(this.app);

		this.initMiddlewares();
		this.initTechRoutes();
		this.initAppRoutes();
	}

	initMiddlewares () {
		const app = this.app;

		app.use(morgan(config.logging.morganFormat));
	}

	initTechRoutes () {
		const app = this.app;

		app.get('/telemetry/healthcheck', (req, res) => {
			res.send({healthy: true});
		});

		app.get('/api/ping', (req, res) => {
			res.send({pong: true});
		});
	}

	initAppRoutes () {
    	const app = this.app;

		app.use('/api', bodyParser.json());

		app.get('/api/ideas', this.auth.vk_app_auth_key, async (req, res) => {
			const {limit, skip, parentId} = req.query;
			const ideas = await this.logic.getIdeasList(
				(req as any).realm, // TODO: расширить req в стратегии паспорта
				req.user,
				limit ? parseInt(limit, 10) : undefined,
				skip ? parseInt(skip, 10) : undefined,
				parentId ? `${parentId}` : undefined,
			);
			res.send(ideas);
        });
        
		app.get('/api/ideas/:id', this.auth.vk_app_auth_key, async (req, res) => {
            const result = await this.logic.getIdeaById((req as any).realm, req.user, req.params.id);
            res.send(result);
        });
        
		app.post('/api/ideas', this.auth.vk_app_auth_key, async (req, res) => {
            const result = await this.logic.publishIdea((req as any).realm, req.user, req.body);
			res.send(result);
		});
        
		app.patch('/api/ideas/:id', this.auth.vk_app_auth_key, async (req, res) => {
			res.send({result: 'Idea edited'});
		});
        
		app.delete('/api/ideas/:id', this.auth.vk_app_auth_key, async (req, res) => {
			const status = await this.logic.deleteIdea(req.user._id, req.params.id);
			res.status(status || 500).json({success: status === 200});
		});

		app.post('/api/vote', this.auth.vk_app_auth_key, async (req, res) => { // OPTIMIZATION: использовать лёгкий vote а не тяжёлый reVote в реализации, отслеживая логику на клиенте
			const result = await this.logic.voteAndReturnNewValues(req.user._id, req.body.ideaId, req.body.voteType);
			res.send(result);
		});

		app.post('/api/revote', this.auth.vk_app_auth_key, async (req, res) => {
			const result = await this.logic.voteAndReturnNewValues(req.user._id, req.body.ideaId, req.body.voteType);
			res.send(result);
		});

		app.get('/api/users/me', this.auth.vk_app_auth_key, async (req, res) => {
			res.send(req.user);
		});

		app.get('/api/settings', this.auth.vk_app_auth_key, async (req, res) => {
			res.send({
				me: req.user,
				group: {realm: (req as any).realm},
			});
		});
    }

    listen (port?: number) {
        this.app.listen(port);
        console.log(connected(`Start listening at port ${port}`));
    }
}
