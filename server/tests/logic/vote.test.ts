
import config from '../../config'
import ORM from '../../orm'
import Logic from '../../logic'
import {clearDatabase} from '../orm/helper'

let orm: ORM;
let logic: Logic;

beforeAll(async () => {
	orm = new ORM(config.mongoose);
	logic = new Logic(orm);
	await orm.connect();
});

beforeEach(async () => {
	await clearDatabase();
});

afterAll(async () => {
	await orm.disconnect();
});

test('vote for one idea', async () => {
	const user = new ORM.User({name: 'name', login: 'login'});
	await user.save();

	const idea = new ORM.Idea({title: 'title'});
	await idea.save();

	const userVote1 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote1).toBeDefined();
	expect(userVote1.myVote).toBe(0);

	await logic.vote(user._id, idea._id, 3);

	const userVote2 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote2).toBeDefined();
	expect(userVote2.myVote).toBe(3);
});

test('change vote', async () => {
	const user = new ORM.User({name: 'name', login: 'login'});
	await user.save();

	const idea = new ORM.Idea({title: 'title'});
	await idea.save();

	const userVote1 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote1).toBeDefined();
	expect(userVote1.myVote).toBe(0);

	await logic.vote(user._id, idea._id, 3);

	const userVote2 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote2).toBeDefined();
	expect(userVote2.myVote).toBe(3);

	await logic.vote(user._id, idea._id, 4);

	const userVote3 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote3).toBeDefined();
	expect(userVote3.myVote).toBe(4);
});

xtest('vote for two ideas', async () => {
	const user = new ORM.User({name: 'name', login: 'login'});
	await user.save();

	const idea = new ORM.Idea({title: 'title'});
	await idea.save();

	const userVote1 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote1).toBeDefined();
	expect(userVote1.myVote).toBe(0);

	await logic.vote(user._id, idea._id, 3);

	const userVote2 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote2).toBeDefined();
	expect(userVote2.myVote).toBe(3);
});
