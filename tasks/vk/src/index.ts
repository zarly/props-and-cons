
import { board, wall, likes } from '../vk'
import serverConfig from '../../../server/config'
import ORM from '../../../server/orm'
// import { getTopicCommentsByTopics } from './logic';

(async function init () {
    console.log('Start');
    // const group_id = 23333093;
    const group_id = 119446;

    const orm = new ORM(serverConfig.mongoose, true);
    await orm.connect();

    const topics: any = (await board.getTopics({group_id})).items;
    for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        if (!topic.first_comment) continue;

        const idea = new ORM.Idea({
            type: ORM.IdeaType.question,
            // realm: `vk:${group_id}`,
            realm: `vk:132657268`,
            title: topic.title,
            description: topic.first_comment,
            updatedAt: topic.updated * 1000,
            createdAt: topic.created * 1000,
        });
        await idea.save();
        topics[i] = {
            index: i,
            vk: topic,
            mongo: idea,
        };
    }
    console.log('topics =', topics);

    let topicComments : any[] = [];
    for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        console.log(`${i}/${topics.length} сomments = ${topicComments.length}`);
        const data = await board.getComments({
            group_id,
            topic_id: topic.vk.id,
        });
        const proper = data.items
            .filter((o: any) => o.likes.count)
            .filter((o: any) => !o.attachments)
            .filter((o: any) => o.text)
            .filter((o: any) => o.text[0] !== '[');
        console.log('data =', proper);

        for (let j = 0; j < proper.length; j++) {
            const answer = proper[j];
            const idea = await ORM.Idea.createAndRegister({
                type: ORM.IdeaType.plus,
                // realm: `vk:${group_id}`,
                realm: `vk:132657268`,
                parentIdea: topic.mongo._id,
                description: answer.text,
                updatedAt: topic.updated ? topic.updated * 1000 : undefined,
                createdAt: topic.created ? topic.created * 1000 : undefined,
            });
        }

        topicComments = topicComments.concat(proper);
    }

    // const comments = await getTopicCommentsByTopics(topics, group_id);
    // const liked = comments.filter(o => o.likes.count);
    // console.log('liked =', liked.length);

    // const rating = {};
    // const who = await getTopicCommentLikesByTopicComments(liked, group_id, ({from_id: a, id}, b) => {
    //     if (a !== -group_id) {
    //         console.log(`${a} => ${b}`);
    //     }
    //     rating[a] = rating[a] || {
    //         count: 0,
    //         likers: {},
    //         posts: {},
    //     };
    //     rating[a].count++;
    //     rating[a].likers[b] = 1;
    //     rating[a].posts[id] = 1;
    // });
    // console.log('who =', who.length);
    // printRating(rating);


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

    await orm.disconnect();
})();
