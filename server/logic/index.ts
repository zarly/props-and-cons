
import {Idea} from '../orm/idea'
import {User} from '../orm/user'
import ORM, {ObjectId, MongoIdType} from '../orm'
import {IdeaForDetails, IdeaForList, ItemList} from '../interfaces'

export default class Logic {
    orm: ORM;

    constructor (orm: ORM) {
        this.orm = orm;
	}

	/**
	 * Добавляет новую идею
	 *
	 * @param {String} realm
	 * @param {User} user
	 * @param {Idea} raw
	 */
	async publishIdea (realm: string, user: User, raw: Idea) : Promise<Idea> {
		const idea = ORM.Idea.createAndRegister({
			type: raw.type || 1,
			title: (raw.title || '').substr(0, 200),
			description: (raw.description || '').substr(0, 2000),

			realm: realm,
			author: user._id,
			parentIdea: raw.parentIdea ? ObjectId(<any>raw.parentIdea) : null,

			votesPlus: [user._id],
		});
		return idea;
	}

	/**
	 * Возвращает список идей
	 *
	 * @param {String} realm
	 * @param {User} user
	 * @param {Number} limit
	 * @param {Number} skip
	 * @param {String} parentId
	 * @returns {Promise<ItemList<IdeaForList>>}
	 */
	async getIdeasList (realm: string, user: User, limit: number = 10, skip: number = 0, parentId: string = null) : Promise<ItemList<IdeaForList>> {
		limit = Math.min(limit, 100); // TODO: вынести в сервер и установить такие проверки везде
		return await ORM.Idea.getIdeasList(realm, user._id, limit, skip, parentId);
	}

	/**
	 * Возвращает информацию об идее по её id
	 *
	 * @param {String} realm
	 * @param {User} user
	 * @param {string} ideaId
	 * @returns {Promise<IdeaForDetails>}
	 */
	async getIdeaById (realm: string, user: User, ideaId: string) : Promise<IdeaForDetails> {
		const idea = await ORM.Idea.readWithChildren(user._id, ideaId);
		const author = await ORM.User.publicInfo(idea.author);

		const parentIdea = <any>(await ORM.Idea.findById(idea.parentIdea, ['title']));

		const comments = await ORM.Idea.resolveIdeas(user._id, idea.comments);
		const alternatives = await ORM.Idea.resolveIdeas(user._id, idea.alternatives);
		const ideasPlus = await ORM.Idea.resolveIdeas(user._id, idea.ideasPlus);
		const ideasMinus = await ORM.Idea.resolveIdeas(user._id, idea.ideasMinus);
		const implementations = await ORM.Idea.resolveIdeas(user._id, idea.implementations);

		return {
			_id: idea._id,
			type: idea.type,
			title: idea.title,
			description: idea.description,

			author: author,
			parentIdeas: [parentIdea].filter(o => o),

			votesPlusCount: idea.votesPlusCount,
			votesMinusCount: idea.votesMinusCount,
			skipsCount: idea.skipsCount,
			viewsCount: idea.viewsCount,
			reportsCount: idea.reportsCount,

			myVote: idea.myVote,

			ideasPlusCount: idea.ideasPlusCount,
			ideasMinusCount: idea.ideasMinusCount,
			commentsCount: idea.commentsCount,
			alternativesCount: idea.alternativesCount,
			implementationsCount: idea.implementationsCount,

			ideasPlus: ideasPlus,
			ideasMinus: ideasMinus,
			comments: comments,
			alternatives: alternatives,
			implementations: implementations,

			createdAt: idea.createdAt,
		};
	}

	/**
	 * Сохраняет голос за идею
	 *
	 * @param {MongoIdType} userId
	 * @param {MongoIdType} ideaId
	 * @param {number} voteType
	 */
	async voteAndReturnNewValues (userId: MongoIdType, ideaId: MongoIdType, voteType: number) {
		await ORM.Idea.vote(userId, ideaId, voteType);
		return await ORM.Idea.getVotes(userId, ideaId);
	}
}
