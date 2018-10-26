
import config from '../../config'
import ORM from '../../orm'
import * as mongoose from 'mongoose'

test('connect', async () => {
    const orm = new ORM(config.mongoose);
    const db = await orm.connect();
    expect(db).toBe(mongoose);
    await mongoose.connection.close();
});

describe('Idea', () => {
	const Idea = ORM.Idea;
    let orm;

    beforeAll(async () => {
        orm = new ORM(config.mongoose);
        await orm.connect();
    });

    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('save root idea', async () => {
        const idea = new Idea({title: 'Idea title'});
    
        expect(await Idea.countDocuments()).toBe(0);
        
        await idea.save();
        
        expect(await Idea.countDocuments()).toBe(1);
	});

	test('save child ideas default', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea1 = await Idea.createAndRegister({title: 'Child idea 1', parentIdea: rootIdea._id});
		const idea2 = await Idea.createAndRegister({title: 'Child idea 2', parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);

		expect(actualRootIdea.title).toBe(rootIdea.title);
		expect(actualRootIdea.comments.length).toEqual(2);
		expect(actualRootIdea.comments[0]).toEqual(idea1._id);
		expect(actualRootIdea.comments[1]).toEqual(idea2._id);
	});

	test('save child comment', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaTypes.comment, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.comments.length).toEqual(1);
		expect(actualRootIdea.comments[0]).toEqual(idea._id);
	});

	test('save child alternative', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaTypes.alternative, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.alternatives.length).toEqual(1);
		expect(actualRootIdea.alternatives[0]).toEqual(idea._id);
	});

	test('save child plus', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaTypes.plus, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.ideasPlus.length).toEqual(1);
		expect(actualRootIdea.ideasPlus[0]).toEqual(idea._id);
	});

	test('save child minus', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaTypes.minus, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.ideasMinus.length).toEqual(1);
		expect(actualRootIdea.ideasMinus[0]).toEqual(idea._id);
	});

	test('save child implementation', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});
		const idea = await Idea.createAndRegister({title: 'Child idea', type: ORM.IdeaTypes.implementation, parentIdea: rootIdea._id});

		const actualRootIdea = await Idea.findById(rootIdea._id);
		expect(actualRootIdea.implementations.length).toEqual(1);
		expect(actualRootIdea.implementations[0]).toEqual(idea._id);
	});

	test('readWithChildren read comments', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});

		await Idea.createAndRegister({title: 'Child idea 1', parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(rootIdea._id);
		expect(data.comments[0]).toBeInstanceOf(Idea);
	});

	test('limit in readWithChildren works', async () => {
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = await Idea.createAndRegister({title: 'Root idea title'});

		await Idea.createAndRegister({title: 'Child idea', parentIdea: rootIdea._id});
		await Idea.createAndRegister({title: 'Child idea', parentIdea: rootIdea._id});
		await Idea.createAndRegister({title: 'Child idea', parentIdea: rootIdea._id});
		await Idea.createAndRegister({title: 'Child idea', parentIdea: rootIdea._id});
		await Idea.createAndRegister({title: 'Child idea', parentIdea: rootIdea._id});

		const data = await Idea.readWithChildren(rootIdea._id, 3);
		expect(data.comments.length).toBe(3);
	});
});
