
import { method, extendLimit } from './_method';

export const users = {
    async getUser (id: number) : Promise<{count: number, items: Array<any>}> {
        const array = await method('users.get', {
            user_ids: [id],
            fields: 'sex,photo_100',
            lang: 'ru',
        });
        return array && array[0];
    },
};
