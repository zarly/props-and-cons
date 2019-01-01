
import * as express from 'express'
import * as expressSession from 'express-session'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as connectMongo from 'connect-mongo'
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
const AUTH_SECRET = 'Nothing Secret'; // TODO: забирать из переменной среды

const MongoStore = connectMongo(expressSession);

// TODO: CORS на POST

interface Request extends Express.Request {
	user?: any;
	body?: any;
	query?: any;
	params?: any;
}

interface Response extends Express.Response {
	send: Function;
	json: Function;
	status: Function;
	redirect: Function;
}

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

		app.disable('x-powered-by');

		app.use(morgan(config.logging.morganFormat));

		const sessionTTL = 1000 * 60 * 60 * 24 * 365 * 20; // 20 лет
		app.use(expressSession({
			secret: AUTH_SECRET,
			name: 'session',
			cookie: {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: sessionTTL,
			},
			saveUninitialized: true,
			resave: false,
			store: new MongoStore({
				mongooseConnection: this.orm.connection,
				ttl: sessionTTL,
			}),
		}));
		app.use('/api', bodyParser.json());
	}

	initTechRoutes () {
		const app = this.app;

		app.get('/telemetry/healthcheck', (req: Request, res: Response) => {
			res.send({healthy: true});
		});

		app.get('/api/ping', (req: Request, res: Response) => {
			res.send({pong: true});
		});
	}

	initAppRoutes () {
    	const app = this.app;

		app.get('/api/auth/vk_app', this.auth.vkAppSign, async (req: Request, res: Response) => {
			(req as any).session.userId = req.user._id;
			const vkParams: any = req.vkParams || {};

			const referrer: string = vkParams.referrer;
			const referrerMatch = referrer.match(new RegExp('^idea_([0-9a-z]+)'));
			if (referrerMatch) {
				const ideaId = referrerMatch[1];
				res.redirect(`/idea/${ideaId}`);
			}

			const realmApp = (vkParams.api_id && `a${vkParams.api_id}`) || 'common';
			const realmOwner = (vkParams.group_id && `g${vkParams.group_id}`) || (vkParams.user_id && `u${vkParams.user_id}`) || 'common';
			res.redirect(`/realm/vk/${realmApp}/${realmOwner}`);
		});

		app.get('/api/auth/status', this.auth.userAuth, async (req: Request, res: Response) => { // TODO: remove after auth complete
			res.json({
				session: (req as any).session,
				user: (req as any).user,
			});
		});

		app.get('/api/ideas', this.auth.userAuth, async (req: Request, res: Response) => {
			const {limit, skip, type, parentId, realm} = req.query;
			const ideas = await this.logic.getIdeasList(
				realm, // TODO: расширить req в стратегии паспорта
				req.user,
				limit ? parseInt(limit, 10) : undefined,
				skip ? parseInt(skip, 10) : undefined,
				parentId ? `${parentId}` : undefined,
				type ? parseInt(type, 10) : undefined,
			);
			res.send(ideas);
        });

		app.get('/api/ideas/children', this.auth.userAuth, async (req: Request, res: Response) => {
			const {limit, skip, type, parentId} = req.query;
			const ideas = await this.logic.getIdeaChildren(
				(req as any).realm, // TODO: расширить req в стратегии паспорта
				req.user,
				limit ? parseInt(limit, 10) : undefined,
				skip ? parseInt(skip, 10) : undefined,
				parentId ? `${parentId}` : undefined,
				type ? parseInt(type, 10) : undefined,
			);
			res.send(ideas);
        });
        
		app.get('/api/ideas/:id', this.auth.userAuth, async (req: Request, res: Response) => {
            const result = await this.logic.getIdeaById((req as any).realm, req.user, req.params.id);
            res.send(result);
        });
        
		app.post('/api/ideas', this.auth.userAuth, async (req: Request, res: Response) => {
            const result = await this.logic.publishIdea((req as any).realm, req.user, req.body);
			res.send(result);
		});
        
		app.patch('/api/ideas/:id', this.auth.userAuth, async (req: Request, res: Response) => {
			res.send({result: 'Idea edited'});
		});
        
		app.delete('/api/ideas/:id', this.auth.userAuth, async (req: Request, res: Response) => {
			const status = await this.logic.deleteIdeaWithCheckAccess(req.user, req.params.id);
			res.status(status || 500).json({success: status === 200});
		});

		app.post('/api/vote', this.auth.userAuth, async (req: Request, res: Response) => { // OPTIMIZATION: использовать лёгкий vote а не тяжёлый reVote в реализации, отслеживая логику на клиенте
			const result = await this.logic.voteAndReturnNewValues(req.user._id, req.body.ideaId, req.body.voteType);
			res.send(result);
		});

		app.post('/api/revote', this.auth.userAuth, async (req: Request, res: Response) => {
			const result = await this.logic.voteAndReturnNewValues(req.user._id, req.body.ideaId, req.body.voteType);
			res.send(result);
		});

		app.get('/api/users/me', this.auth.userAuth, async (req: Request, res: Response) => {
			res.send(req.user);
		});

		app.get('/api/settings', this.auth.userAuth, async (req: Request, res: Response) => {
			res.send({
				me: req.user,
				realm: (req as any).realmEnt,
			});
		});
    }

    listen (port?: number) {
        this.app.listen(port);
        console.log(connected(`Start listening at port ${port}`));
    }
}
