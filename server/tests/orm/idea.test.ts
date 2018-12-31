
import config from '../../config'
import ORM, {ObjectId, VoteType} from '../../orm'
import {clearDatabase} from './helper'

const Idea = ORM.Idea;
let orm: ORM;
let user: any;

beforeAll(async () => {
	orm = new ORM(config.mongoose);
	await orm.connect();

	user = new ORM.User({name: 'ttt', login: 'idea_test_login'});
	user.save();
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
		expect(actualRootIdea.commentsCount).toEqual(2);
	});

	test('comment', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaType.comment, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.commentsCount).toEqual(1);
	});

	test('plus', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaType.plus, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.ideasPlusCount).toEqual(1);
	});

	test('minus', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaType.minus, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.ideasMinusCount).toEqual(1);
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

		const data = await Idea.readWithChildren(user._id, rootIdea._id, 3);
		expect(data).toBeDefined();
		expect(data.commentsCount).toBe(3);
	});

	test('resolve comments', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		await Idea.createAndRegister({title: 'Child idea 1', type: ORM.IdeaType.comment, parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(user._id, rootIdea._id);
		expect(data.comments[0]).toBeInstanceOf(ObjectId);
	});

	test('resolve plus', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		await Idea.createAndRegister({title: 'Child idea 1', type: ORM.IdeaType.plus, parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(user._id, rootIdea._id);
		expect(data.ideasPlusCount).toBe(1);
	});

	test('resolve minus', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		await Idea.createAndRegister({title: 'Child idea 1', type: ORM.IdeaType.minus, parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(user._id, rootIdea._id);
		expect(data.ideasMinusCount).toBe(1);
	});
});

describe('voting', () => {
	test('single vote', async () => {
		const user = new ORM.User({name: 'name', login: 'login'});
		await user.save();

		const idea = new ORM.Idea({title: 'title'});
		await idea.save();

		const data1 = await Idea.readWithChildren(user._id, idea._id);
		expect(data1.votesPlusCount).toBe(0);

		await Idea.vote(user._id, idea._id, VoteType.plus);

		const data2 = await Idea.readWithChildren(user._id, idea._id);
		expect(data2.votesPlusCount).toBe(1);
	});

	test('double vote not count', async () => {
		const user = new ORM.User({name: 'name', login: 'login'});
		await user.save();

		const idea = new ORM.Idea({title: 'title'});
		await idea.save();

		const data1 = await Idea.readWithChildren(user._id, idea._id);
		expect(data1.votesPlusCount).toBe(0);

		await Idea.vote(user._id, idea._id, VoteType.plus);
		await Idea.vote(user._id, idea._id, VoteType.plus);

		const data2 = await Idea.readWithChildren(user._id, idea._id);
		expect(data2.votesPlusCount).toBe(1);
	});

	test('voteCancel works fine', async () => {
		const user = new ORM.User({name: 'name', login: 'login'});
		await user.save();

		const idea = new ORM.Idea({title: 'title'});
		await idea.save();

		const data1 = await Idea.readWithChildren(user._id, idea._id);
		expect(data1.votesPlusCount).toBe(0);

		await Idea.vote(user._id, idea._id, VoteType.plus);

		const data2 = await Idea.readWithChildren(user._id, idea._id);
		expect(data2.votesPlusCount).toBe(1);

		await Idea.voteCancel(user._id, idea._id, VoteType.plus);

		const data3 = await Idea.readWithChildren(user._id, idea._id);
		expect(data3.votesPlusCount).toBe(0);
	});

	test('reVote works fine', async () => {
		const user = new ORM.User({name: 'name', login: 'login'});
		await user.save();

		const idea = new ORM.Idea({title: 'title'});
		await idea.save();

		const data1 = await Idea.readWithChildren(user._id, idea._id);
		expect(data1.votesPlusCount).toBe(0);
		expect(data1.votesMinusCount).toBe(0);

		await Idea.vote(user._id, idea._id, VoteType.plus);

		const data2 = await Idea.readWithChildren(user._id, idea._id);
		expect(data2.votesPlusCount).toBe(1);
		expect(data2.votesMinusCount).toBe(0);

		await Idea.reVote(user._id, idea._id, VoteType.minus);

		const data3 = await Idea.readWithChildren(user._id, idea._id);
		expect(data3.votesPlusCount).toBe(0);
		expect(data3.votesMinusCount).toBe(1);
	});
});
