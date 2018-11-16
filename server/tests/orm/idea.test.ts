
import config from '../../config'
import ORM from '../../orm'
import {clearDatabase} from './helper'

const Idea = ORM.Idea;
let orm: ORM;

beforeAll(async () => {
	orm = new ORM(config.mongoose);
	await orm.connect();
});

beforeEach(clearDatabase);

afterAll(async () => {
	await orm.disconnect();
});

test('save root idea', async () => {
	const idea = new Idea({title: 'Idea title'});

	expect(await Idea.countDocuments()).toBe(0);

	await idea.save();

	expect(await Idea.countDocuments()).toBe(1);
});

describe('save children', () => {
	test('ideas default', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea1 = await Idea.createAndRegister({title: 'Child idea 1', parentIdea: rootIdea._id});
		const idea2 = await Idea.createAndRegister({title: 'Child idea 2', parentIdea: rootIdea._id});

		expect(await Idea.countDocuments()).toBe(3);

		const actualRootIdea = await Idea.findById(rootIdea._id);

		expect(actualRootIdea.title).toBe(rootIdea.title);
		expect(actualRootIdea.comments.length).toEqual(2);
		expect(actualRootIdea.comments[0]).toEqual(idea1._id);
		expect(actualRootIdea.comments[1]).toEqual(idea2._id);
	});

	test('comment', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaType.comment, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.comments.length).toEqual(1);
		expect(actualRootIdea.comments[0]).toEqual(idea._id);
	});

	test('alternative', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaType.alternative, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.alternatives.length).toEqual(1);
		expect(actualRootIdea.alternatives[0]).toEqual(idea._id);
	});

	test('plus', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaType.plus, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.ideasPlus.length).toEqual(1);
		expect(actualRootIdea.ideasPlus[0]).toEqual(idea._id);
	});

	test('minus', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaType.minus, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.ideasMinus.length).toEqual(1);
		expect(actualRootIdea.ideasMinus[0]).toEqual(idea._id);
	});

	test('implementation', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaType.implementation, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.implementations.length).toEqual(1);
		expect(actualRootIdea.implementations[0]).toEqual(idea._id);
	});
});

describe('method readWithChildren', () => {
	test('limit works', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});

		await Idea.createAndRegister({title: 'Child idea', parentIdea: rootIdea._id});
		await Idea.createAndRegister({title: 'Child idea', parentIdea: rootIdea._id});
		await Idea.createAndRegister({title: 'Child idea', parentIdea: rootIdea._id});
		await Idea.createAndRegister({title: 'Child idea', parentIdea: rootIdea._id});
		await Idea.createAndRegister({title: 'Child idea', parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(rootIdea._id, 3);
		expect(data).toBeDefined();
		expect(data.comments.length).toBe(3);
	});

	test('resolve comments', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		await Idea.createAndRegister({title: 'Child idea 1', type: ORM.IdeaType.comment, parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(rootIdea._id);
		expect(data.comments[0]).toBeInstanceOf(Idea);
	});

	test('resolve alternative', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		await Idea.createAndRegister({title: 'Child idea 1', type: ORM.IdeaType.alternative, parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(rootIdea._id);
		expect(data.alternatives[0]).toBeInstanceOf(Idea);
	});

	test('resolve plus', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		await Idea.createAndRegister({title: 'Child idea 1', type: ORM.IdeaType.plus, parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(rootIdea._id);
		expect(data.ideasPlus[0]).toBeInstanceOf(Idea);
	});

	test('resolve minus', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		await Idea.createAndRegister({title: 'Child idea 1', type: ORM.IdeaType.minus, parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(rootIdea._id);
		expect(data.ideasMinus[0]).toBeInstanceOf(Idea);
	});

	test('resolve implementation', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		await Idea.createAndRegister({title: 'Child idea 1', type: ORM.IdeaType.implementation, parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(rootIdea._id);
		expect(data.implementations[0]).toBeInstanceOf(Idea);
	});
});

describe('method vote', () => {
	test('limit works', async () => {
		expect(await Idea.countDocuments()).toBe(0);
	});
});

describe('method readDetails', () => {
	test('count votes', async () => {
		const user = new ORM.User({name: 'name', login: 'login'});
		await user.save();

		const idea = new ORM.Idea({title: 'title'});
		await idea.save();

		let details = await Idea.readDetails(idea._id);
		expect(details).toBeDefined();
		expect(details.votesPlusCount).toBe(0);
		expect(details.votesMinusCount).toBe(0);
		expect(details.skipsCount).toBe(0);
		expect(details.viewsCount).toBe(0);
		expect(details.reportsCount).toBe(0);

		await Idea.vote(user._id, idea._id, 3);
		details = await Idea.readDetails(idea._id);
		expect(details.votesPlusCount).toBe(1);

		await Idea.vote(user._id, idea._id, 3);
		details = await Idea.readDetails(idea._id);
		expect(details.votesPlusCount).toBe(1);

		await Idea.vote(user._id, idea._id, 4);
		details = await Idea.readDetails(idea._id);
		expect(details.votesMinusCount).toBe(1);
		expect(details.votesPlusCount).toBe(0);
	});

	test('count votes for two users', async () => {
		const user1 = new ORM.User({name: 'name', login: 'login_1', vkUid: '111'});
		await user1.save();
		const user2 = new ORM.User({name: 'name', login: 'login_2', vkUid: '222'});
		await user2.save();

		const idea = new ORM.Idea({title: 'title'});
		await idea.save();

		let details = await Idea.readDetails(idea._id);
		expect(details).toBeDefined();
		expect(details.votesPlusCount).toBe(0);
		expect(details.votesMinusCount).toBe(0);
		expect(details.skipsCount).toBe(0);
		expect(details.viewsCount).toBe(0);
		expect(details.reportsCount).toBe(0);

		await Idea.vote(user1._id, idea._id, 3);
		details = await Idea.readDetails(idea._id);
		expect(details.votesPlusCount).toBe(1);

		await Idea.vote(user2._id, idea._id, 3);
		details = await Idea.readDetails(idea._id);
		expect(details.votesPlusCount).toBe(2);

		await Idea.vote(user1._id, idea._id, 4);
		details = await Idea.readDetails(idea._id);
		expect(details.votesMinusCount).toBe(1);
		expect(details.votesPlusCount).toBe(1);
	});
});
