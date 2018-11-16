
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
	const user = new User({name: 'name', login: 'login'});

	expect(await User.countDocuments()).toBe(0);

	await user.save();

	expect(await User.countDocuments()).toBe(1);
});

describe('vk auth', () => {
	test('find by vkUid', async () => {
		const result = await User.findOne({vkUid: 'unexisted'});
		expect(result).toBeFalsy();
	});

	xtest('loginOrRegisterVk', async () => {
		const user = await User.loginOrRegisterVk('some_id');
		expect(user).toBeInstanceOf(User);
		expect(user.vkUid).toBe('some_id');
	});
});

describe('vote', () => {
	test('find by vkUid', async () => {
		const result = await User.findOne({vkUid: 'unexisted'});
		expect(result).toBeFalsy();
	});

	xtest('loginOrRegisterVk', async () => {
		const user = await User.loginOrRegisterVk('some_id');
		expect(user).toBeInstanceOf(User);
		expect(user.vkUid).toBe('some_id');
	});
});
