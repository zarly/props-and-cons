
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

describe('vk auth', () => {
	test('find by vk_uid', async () => {
		const result = await User.findOne({vk_uid: 'unexisted'});
		expect(result).toBeFalsy();
	});

	test('loginOrRegisterVk', async () => {
		const user = await User.loginOrRegisterVk('some_id');
		expect(user).toBeInstanceOf(User);
		expect(user.vk_uid).toBe('some_id');
	});
});
