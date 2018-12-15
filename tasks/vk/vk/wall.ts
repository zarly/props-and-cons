
import { method, extendLimit } from './_method';

export interface Post {
    id: number;
    from_id: number;
    owner_id: number;
    date: number;
    marked_as_ads: number;
    post_type: string;
    text: string;
    attachments: Array<any>;
    likes: {count: number};
    reposts: {count: number};
}

export interface Comment {
    id: number;
    from_id: number;
    date: number;
    text: string;
    likes: {count: number};
}

export const wall = {
    async get ({owner_id}: {owner_id: number}) : Promise<{count: number, items: Array<Post>/*, default_order: number, can_add_topics: number*/}> {
        return await extendLimit(method, 21)('wall.get', {
            owner_id,
            count: 25,
            order: 1,
        });
    },
    async getComments ({owner_id, post_id}: {owner_id: number, post_id: number}) : Promise<{count: number, items: Array<Comment>}> {
        return await method('wall.getComments', {
            owner_id,
            post_id,
            need_likes: 1,
            count: 100,
            offset: 0,
            sort: 'desc',
        });
    },
};
