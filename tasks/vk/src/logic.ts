
const Table = require('cli-table');
const { board, wall, likes } = require('../vk');

export async function getTopicCommentsByTopics (topics, group_id) {
    let topicComments = [];
    for (let i = 0; i < topics.length; i++) {
        console.log(`${i}/${topics.length} сomments = ${topicComments.length}`);
        const data = await board.getComments({
            group_id,
            topic_id: topics[i].id,
        });
        topicComments = topicComments.concat(data.items);
    }
    return topicComments;
}

export async function getTopicCommentLikesByTopicComments (topicComments, group_id, visitor = (a,b) => {}) {
    let topicCommentLikes = [];
    for (let i = 0; i < topicComments.length; i++) {
        console.log(`${i}/${topicComments.length} topicCommentLikes = ${topicCommentLikes.length}`);
        const data = await likes.getList({
            type: 'topic_comment',
            owner_id: -group_id,
            item_id: topicComments[i].id,
        });
        topicCommentLikes = topicCommentLikes.concat(data.items);
        data.items.forEach(o => visitor(topicComments[i], o));
    }
    return topicCommentLikes;
}

export async function getWallTopicLikesByWallTopics (wallTopics, group_id, visitor = (a,b) => {}) {
    let wallTopicLikes = [];
    for (let i = 0; i < wallTopics.length; i++) {
        console.log(`${i}/${wallTopics.length} wallTopicLikes = ${wallTopicLikes.length}`);
        const data = await likes.getList({
            type: 'post',
            owner_id: group_id,
            item_id: wallTopics[i].id,
        });
        wallTopicLikes = wallTopicLikes.concat(data.items);
        data.items.forEach(o => visitor(wallTopics[i], o));
    }
    return wallTopicLikes;
}

export async function getWallTopicCommentsByWallTopics (wallTopics) {
    let wallComments = [];
    for (let i = 0; i < wallTopics.length; i++) {
        console.log(`${i}/${wallTopics.length} wallComments = ${wallComments.length}`);
        const data = await wall.getComments({
            owner_id: wallTopics[i].owner_id,
            post_id: wallTopics[i].id,
        });
        wallComments = wallComments.concat(data.items);
    }
    return wallComments;
}

export async function getWallTopicCommentLikesByWallTopicComments (wallTopicComments, group_id, visitor = (a,b) => {}) {
    let wallTopicCommentLikes = [];
    for (let i = 0; i < wallTopicComments.length; i++) {
        console.log(`${i}/${wallTopicComments.length} wallTopicCommentLikes = ${wallTopicCommentLikes.length}`);
        const data = await likes.getList({
            type: 'comment',
            owner_id: group_id,
            item_id: wallTopicComments[i].id,
        });
        wallTopicCommentLikes = wallTopicCommentLikes.concat(data.items);
        data.items.forEach(o => visitor(wallTopicComments[i], o));
    }
    return wallTopicCommentLikes;
}

export function printRating (rating) {
    const table = new Table({
        head: ['id', 'likes', 'likers', 'posts'],
        colWidths: [20, 10, 10, 10],
    });
    Object.keys(rating).forEach(k => {
        const v = rating[k];
        table.push([k, v.count, Object.keys(v.likers).length, Object.keys(v.posts).length]);
    });
    console.log(table.toString());
}
