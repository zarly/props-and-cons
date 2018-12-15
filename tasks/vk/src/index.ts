
const { board, wall, likes } = require('../vk');
const Table = require('cli-table');

async function getTopicCommentsByTopics (topics, group_id) {
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

async function getTopicCommentLikesByTopicComments (topicComments, group_id, visitor = (a,b) => {}) {
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

async function getWallTopicLikesByWallTopics (wallTopics, group_id, visitor = (a,b) => {}) {
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

async function getWallTopicCommentsByWallTopics (wallTopics) {
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

async function getWallTopicCommentLikesByWallTopicComments (wallTopicComments, group_id, visitor = (a,b) => {}) {
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

async function main () : Promise<void> {
    console.log('Start');
    // const group_id = 23333093;
    const group_id = 119446;

    const topics = (await board.getTopics({group_id})).items;
    console.log('topics =', topics.length);

    const comments = await getTopicCommentsByTopics(topics, group_id);
    const liked = comments.filter(o => o.likes.count);
    console.log('liked =', liked.length);

    const rating = {};
    const who = await getTopicCommentLikesByTopicComments(liked, group_id, ({from_id: a, id}, b) => {
        if (a !== -group_id) {
            console.log(`${a} => ${b}`);
        }
        rating[a] = rating[a] || {
            count: 0,
            likers: {},
            posts: {},
        };
        rating[a].count++;
        rating[a].likers[b] = 1;
        rating[a].posts[id] = 1;
    });
    console.log('who =', who.length);
    printRating(rating);


    // const wallTopics = (await wall.get({owner_id: -group_id})).items;
    // console.log('w_topics =', wallTopics.length);

    // let wallTopicLikes = await getWallTopicLikesByWallTopics(wallTopics, -group_id, (t, l) => {
    //     if (t.owner_id !== -group_id) console.log(`${t.owner_id} => ${l}`)
    // });
    // console.log('wallTopicLikes =', wallTopicLikes.length);

    // let wallComments = await getWallTopicCommentsByWallTopics(wallTopics);
    // let w_liked = wallComments.filter(o => o.likes.count);
    // console.log('w_liked =', w_liked.length);

    // const wallRating = {};
    // const wallTopicCommentLikes = await getWallTopicCommentLikesByWallTopicComments(w_liked, -group_id, ({from_id: a, id}, b) => {
    //     if (a !== -group_id) {
    //         console.log(`${a} => ${b}`);
    //     }
    //     wallRating[a] = wallRating[a] || {
    //         count: 0,
    //         likers: {},
    //         posts: {},
    //     };
    //     wallRating[a].count++;
    //     wallRating[a].likers[b] = 1;
    //     wallRating[a].posts[id] = 1;
    // });
    // console.log('wallTopicCommentLikes =', wallTopicCommentLikes.length);
    // printRating(wallRating);
}

function printRating (rating) {
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

main();
