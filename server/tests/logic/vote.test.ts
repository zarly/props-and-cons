
import config from '../../config'
import ORM from '../../orm'
import Logic from '../../logic'

let orm: ORM;
let logic: Logic;

beforeAll(async () => {
	orm = new ORM(config.mongoose);
	logic = new Logic(orm);
	await orm.connect();
});

beforeEach(async () => {

});

afterAll(async () => {
	await orm.disconnect();
});

test('vote', async () => {
	const user = new ORM.User({name: 'name', login: 'login'});
	await user.save();

	const idea = new ORM.Idea({title: 'title'});
	await idea.save();

	const userVote1 = await user.getVoteForIdea(idea._id);
	expect(userVote1).toBeDefined();
	expect(userVote1).toBe(0);

	await logic.vote(user._id, idea._id, 3);

	const userVote2 = await user.getVoteForIdea(idea._id);
	expect(userVote2).toBeDefined();
	// expect(userVote2).toBe(3);

	// await logic.vote(user._id, idea._id, 4);
    //
	// const userVote3 = await user.getVoteForIdea(idea._id);
	// expect(userVote3).toBeDefined();
	// expect(userVote3).toBe(4);
});
