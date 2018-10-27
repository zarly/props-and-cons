
import config from '../../config'
import ORM from '../../orm'
import {clearDatabase} from './helper'

const User = ORM.User;
let orm: ORM;

beforeAll(async () => {
	orm = new ORM(config.mongoose);
	await orm.connect();
});

beforeEach(clearDatabase);

afterAll(async () => {
	await orm.disconnect();
});

test('save user', async () => {
	const idea = new User({name: 'name', login: 'login'});

	expect(await User.countDocuments()).toBe(0);

	await idea.save();

	expect(await User.countDocuments()).toBe(1);
});
