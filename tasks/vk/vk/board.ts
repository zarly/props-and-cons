
import { method, extendLimit } from './_method';

export interface Topic {
    id: number;
    title: string;
    created: number;
    created_by: number;
    updated: number;
    updated_by: number;
    is_closed: number;
    is_fixed: number;
    comments: number;
}

export interface TopicComment {
    id: number;
    from_id: number;
    date: number;
    text: string;
    likes: {
        count: number,
    };
}

export const board = {
    async getTopics ({group_id}: {group_id: number}) : Promise<{count: number, items: Array<Topic>}> {
        return await extendLimit(method)('board.getTopics', {
            group_id,
            count: 20,
            order: 1,
        });
    },
    async getComments ({group_id, topic_id}: {group_id: number, topic_id: number}) : Promise<{count: number, items: Array<TopicComment>}> {
        return await extendLimit(method)('board.getComments', {
            group_id,
            topic_id,
            need_likes: 1,
            count: 100,
            sort: 'desc',
        });
    },
};
