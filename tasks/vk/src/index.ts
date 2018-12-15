
import { board, wall, likes } from '../vk'
import serverConfig from '../../../server/config'
import ORM from '../../../server/orm'
// import { getTopicCommentsByTopics } from './logic';
import {getAuthorInfo} from './user_storage'

(async function init () {
    console.log('Start');
    // const group_id = 23333093;
    const group_id = 119446;
    // const realm = `vk:${group_id}`;
    const realm = `vk:132657268`; // TODO: заменить на реальный реалм

    const orm = new ORM(serverConfig.mongoose, true);
    await orm.connect();

    const topics: any = (await board.getTopics({group_id})).items;
    for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        if (!topic.first_comment) continue;

        const authorInfo = await getAuthorInfo(topic.created_by);
        const idea = new ORM.Idea({
            type: ORM.IdeaType.question,
            realm,
            author: authorInfo,
            title: topic.title,
            description: topic.first_comment,
            voteRating: 1,
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
    // console.log('topics =', topics);

    let topicComments : any[] = [];
    for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        console.log(`${i}/${topics.length} сomments = ${topicComments.length}`);
        const data = await board.getComments({
            group_id,
            topic_id: topic.vk.id,
        });
        const proper = data.items
            .filter((o: any) => o.likes.count >= 1)
            .filter((o: any) => !o.attachments)
            .filter((o: any) => o.text)
            .filter((o: any) => o.text[0] !== '[');
        console.log('data =', proper);

        for (let j = 0; j < proper.length; j++) {
            const answer = proper[j];
            const likesList = (await likes.getList({
                type: 'topic_comment',
                owner_id: -group_id,
                item_id: answer.id,
            })).items;
            console.log('likesList =', likesList);

            const authorInfo = await getAuthorInfo(answer.from_id);
            const idea = await ORM.Idea.createAndRegister({
                type: ORM.IdeaType.plus,
                realm,
                author: authorInfo,
                parentIdea: topic.mongo._id,
                description: answer.text,

                voteRating: answer.likes.count,
                votesPlus: likesList,

                updatedAt: answer.date ? answer.date * 1000 : undefined,
                createdAt: answer.date ? answer.date * 1000 : undefined,
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
