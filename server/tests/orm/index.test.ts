
import config from '../../config'
import ORM from '../../orm'
import * as mongoose from 'mongoose'

test('connect', async () => {
    const orm = new ORM(config.mongoose);
    const db = await orm.connect();
    expect(db).toBe(mongoose);
});

describe('Idea', () => {
    let orm;

    beforeAll(async () => {
        orm = new ORM(config.mongoose);
        await orm.connect();
    });

    beforeEach(async () => {
        await ORM.Idea.collection.drop();
    });

    test('save idea', async () => {
        const idea = new ORM.Idea({
            title: 'Idea title',
        });
    
        expect(await ORM.Idea.countDocuments()).toBe(0);
        
        await idea.save();
        
        expect(await ORM.Idea.countDocuments()).toBe(1);
    });
});
