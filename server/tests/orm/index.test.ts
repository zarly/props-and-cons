
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
        const idea = new ORM.Idea({
            title: 'Idea title',
        });
    
        expect(await ORM.Idea.countDocuments()).toBe(0);
        
        await idea.save();
        
        expect(await ORM.Idea.countDocuments()).toBe(1);
    });

    test('save child idea', async () => {
        expect(await ORM.Idea.countDocuments()).toBe(0);

        const rootIdea = new ORM.Idea({
            title: 'Root idea title',
        });
        await rootIdea.save();

        const idea = new ORM.Idea({
            title: 'Child idea title',
            parentIdea: rootIdea._id,
        });
        await idea.save();
    
        expect(await ORM.Idea.countDocuments()).toBe(2);

        const actualRootIdea = await ORM.Idea.findById(rootIdea._id);
        console.log(actualRootIdea);

        expect(actualRootIdea.title).toBe(rootIdea.title);
        expect(actualRootIdea.comments).toEqual([idea._id]);
    });
});
