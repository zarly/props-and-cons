
import config from '../../config'
import ORM from '../../orm'
import * as mongoose from 'mongoose'

test('connect', async () => {
    const orm = new ORM(config.mongoose);
    const db = await orm.connect();
    expect(db).toBe(mongoose);
    await orm.disconnect();
});
