
import { method, extendLimit } from './_method';

export const likes = {
    async getList ({type, owner_id, item_id}: {type: string, owner_id: number, item_id: number}) : Promise<{count: number, items: Array<number>}> {
        return await extendLimit(method)('likes.getList', {
            type,
            owner_id,
            item_id,
            count: 100,
        });
    },
};
