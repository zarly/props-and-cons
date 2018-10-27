
import config from '../../config'
import ORM from '../../orm'
import {clearDatabase} from './helper'

const Group = ORM.Group;
let orm: ORM;

beforeAll(async () => {
	orm = new ORM(config.mongoose);
	await orm.connect();
});

beforeEach(clearDatabase);

afterAll(async () => {
	await orm.disconnect();
});

test('save group', async () => {
	const idea = new Group({name: 'name'});

	expect(await Group.countDocuments()).toBe(0);

	await idea.save();

	expect(await Group.countDocuments()).toBe(1);
});
