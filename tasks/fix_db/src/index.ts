
import serverConfig from '../../../server/config'
import ORM from '../../../server/orm'

(async function init () {
    const orm = new ORM(serverConfig.mongoose, true);
    await orm.connect();

    await fixRootItemsChildCounts();
    await fixRootItemsUpdatedAt();

    await orm.disconnect();
})();

async function fixRootItemsChildCounts () {
    // Чиним только корневые элементы, так как их гораздо меньше, хотя возможно остальные тоже нуждаются в починке
    const rootTypes = [
        ORM.IdeaType.category,
        ORM.IdeaType.question,
        ORM.IdeaType.action,
        ORM.IdeaType.information,
    ];
    const cursor = ORM.Idea.collection.find({type: {$in: rootTypes}});

    for (let i = 0; i < 1000; i++) {
        const doc:any = await cursor.next();
        if (!doc) break;

        doc.commentsCount = await ORM.Idea.count({parentIdea: doc._id, type: ORM.IdeaType.comment});
        doc.ideasPlusCount = await ORM.Idea.count({parentIdea: doc._id, type: ORM.IdeaType.plus});
        doc.ideasMinusCount = await ORM.Idea.count({parentIdea: doc._id, type: ORM.IdeaType.minus});

        await ORM.Idea.collection.save(doc);
        console.log(i, doc.commentsCount, doc.ideasPlusCount, doc.ideasMinusCount, doc.title);
    }
}

async function fixRootItemsUpdatedAt () {
    // Чиним только корневые элементы, так как их гораздо меньше, хотя возможно остальные тоже нуждаются в починке
    const rootTypes = [
        ORM.IdeaType.category,
        ORM.IdeaType.question,
        ORM.IdeaType.action,
        ORM.IdeaType.information,
    ];
    const cursor = ORM.Idea.collection.find({type: {$in: rootTypes}});

    for (let i = 0; i < 1000; i++) {
        const doc:any = await cursor.next();
        if (!doc) break;

        const children = await ORM.Idea
            .find({parentIdea: doc._id}, {_id: 0, createdAt: 1})
            .sort({createdAt: -1})
            .limit(1);

        doc.updatedAt = Math.max(
            ((doc.updatedAt < Date.now()) ? (doc.updatedAt || 0) : 0),
            ((doc.createdAt < Date.now()) ? (doc.createdAt || 0) : 0),
            ((children && children[0] && children[0].createdAt) || 0)
        );

        await ORM.Idea.collection.save(doc);
        console.log(i, (new Date(doc.updatedAt)).toISOString(), doc.title);
    }
}
