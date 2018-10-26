
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
        const idea = new Idea({
            title: 'Idea title',
        });
    
        expect(await Idea.countDocuments()).toBe(0);
        
        await idea.save();
        
        expect(await Idea.countDocuments()).toBe(1);
	});

	test('method addChildIdea', async () => {
		expect(ORM.addChildIdea).toBeDefined();
		expect(await Idea.countDocuments()).toBe(0);

		const rootIdea = new Idea({
			title: 'Root idea title',
		});
		await rootIdea.save();

		const idea1 = new Idea({
			title: 'Child idea 1',
			parentIdea: rootIdea._id,
		});
		await idea1.save();
		// await idea1.registerInParent();

		const idea2 = new Idea({
			title: 'Child idea 2',
			parentIdea: rootIdea._id,
		});
		await idea2.save();
		// await idea2.registerInParent();

		await ORM.addChildIdea(rootIdea._id, idea1);
		await ORM.addChildIdea(rootIdea._id, idea2);

		const actualRootIdea = await Idea.findById(rootIdea._id);

		expect(actualRootIdea.title).toBe(rootIdea.title);
		expect(actualRootIdea.comments.length).toEqual(2);
		expect(actualRootIdea.comments[0]).toEqual(idea1._id);
		expect(actualRootIdea.comments[1]).toEqual(idea2._id);
	});

	xtest('save child idea', async () => {
		expect(await Idea.countDocuments()).toBe(0);

        const rootIdea = new Idea({
            title: 'Root idea title',
        });
        await rootIdea.save();

        const idea = new Idea({
            title: 'Child idea title',
            parentIdea: rootIdea._id,
        });
        await idea.save();
    
        expect(await Idea.countDocuments()).toBe(2);

        const actualRootIdea = await Idea.findById(rootIdea._id);
        console.log(actualRootIdea);

        expect(actualRootIdea.title).toBe(rootIdea.title);
        expect(actualRootIdea.comments).toEqual([idea._id]);
    });
});
