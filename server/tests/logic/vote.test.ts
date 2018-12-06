
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

	const idea = new ORM.Idea({title: 'title', author: user._id});
	await idea.save();

	const userVote1 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote1).toBeDefined();
	expect(userVote1.myVote).toBe(0);
	expect(userVote1.voteRating).toBe(0);

	await logic.voteAndReturnNewValues(user._id, idea._id, 3);

	const userVote2 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote2).toBeDefined();
	expect(userVote2.myVote).toBe(3);
	expect(userVote2.voteRating).toBe(1);
});

test('change vote', async () => {
	const user = new ORM.User({name: 'name', login: 'login'});
	await user.save();

	const idea = new ORM.Idea({title: 'title', author: user._id});
	await idea.save();

	const userVote1 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote1).toBeDefined();
	expect(userVote1.myVote).toBe(0);
	expect(userVote1.voteRating).toBe(0);

	await logic.voteAndReturnNewValues(user._id, idea._id, 3);

	const userVote2 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote2).toBeDefined();
	expect(userVote2.myVote).toBe(3);
	expect(userVote2.voteRating).toBe(1);

	await logic.voteAndReturnNewValues(user._id, idea._id, 4);

	const userVote3 = await logic.getIdeaById('my-realm', user, idea._id);
	expect(userVote3).toBeDefined();
	expect(userVote3.myVote).toBe(4);
	expect(userVote3.voteRating).toBe(-1);
});

test('vote for two ideas', async () => {
	const user = new ORM.User({name: 'name', login: 'login'});
	await user.save();

	const idea1 = new ORM.Idea({title: 'title', author: user._id});
	await idea1.save();

	const idea2 = new ORM.Idea({title: 'title', author: user._id});
	await idea2.save();

	const userVote1 = await logic.getIdeaById('my-realm', user, idea1._id);
	expect(userVote1).toBeDefined();
	expect(userVote1.myVote).toBe(0);
	expect(userVote1.voteRating).toBe(0);

	await logic.voteAndReturnNewValues(user._id, idea1._id, 3);

	const userVote2 = await logic.getIdeaById('my-realm', user, idea1._id);
	expect(userVote2).toBeDefined();
	expect(userVote2.myVote).toBe(3);
	expect(userVote2.voteRating).toBe(1);

	const userVote3 = await logic.getIdeaById('my-realm', user, idea2._id);
	expect(userVote3).toBeDefined();
	expect(userVote3.myVote).toBe(0);
	expect(userVote3.voteRating).toBe(0);

	await logic.voteAndReturnNewValues(user._id, idea2._id, 4);

	const userVote4 = await logic.getIdeaById('my-realm', user, idea1._id);
	expect(userVote4).toBeDefined();
	expect(userVote4.myVote).toBe(3);
	expect(userVote4.voteRating).toBe(1);

	const userVote5 = await logic.getIdeaById('my-realm', user, idea2._id);
	expect(userVote5).toBeDefined();
	expect(userVote5.myVote).toBe(4);
	expect(userVote5.voteRating).toBe(-1);
});
