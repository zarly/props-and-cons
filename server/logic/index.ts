
import {Idea} from '../orm/idea'
import {User} from '../orm/user'
import ORM, {ObjectId} from '../orm'

export default class Logic {
    orm: ORM;

    constructor (orm: ORM) {
        this.orm = orm;
	}

	/**
	 * Добавляет новую идею
	 *
	 * @param {Idea} idea
	 */
	async publishIdea (user: User, raw: Idea) : Promise<Idea> {
		const idea = ORM.Idea.createAndRegister({
			type: raw.type,
			title: raw.title,
			description: raw.description,

			author: user._id,
			parentIdea: raw.parentIdea ? ObjectId(<any>raw.parentIdea) : null,
		});
		return idea;
	}

	/**
	 * Возвращает список идей
	 *
	 * @returns {Array<Idea>}
	 */
	async getIdeasList (user?: User, limit: number = 10, skip: number = 0) : Promise<{count: number, rows: Idea[]}> {
		const filter : any = {
			parentIdea: null,
		};
		const count = await ORM.Idea.countDocuments(filter);
		const rows = await ORM.Idea.find(filter).sort([['createdAt', -1]]).skip(skip).limit(limit);
		return {count, rows};
	}

	async getIdeaById (id: string) {
		const idea = await ORM.Idea.readWithChildren(id);
		return {
			_id: idea._id,
			type: idea.type,
			title: idea.title,
			description: idea.description,

			author: idea.author,
			parentIdeas: [idea.parentIdea].filter(o => o),

			votesPlus: idea.votesPlus && idea.votesPlus.length || 0,
			votesMinus: idea.votesMinus && idea.votesMinus.length || 0,
			skips: idea.skips && idea.skips.length || 0,
			views: idea.views && idea.views.length || 0,
			reports: idea.reports && idea.reports.length || 0,

			ideasPlusCount: idea.votesPlus && idea.ideasPlus.length || 0,
			ideasMinusCount: idea.ideasMinus && idea.ideasMinus.length || 0,
			commentsCount: idea.comments && idea.comments.length || 0,
			alternativesCount: idea.alternatives && idea.alternatives.length || 0,
			implementationsCount: idea.implementations && idea.implementations.length || 0,

			ideasPlus: idea.ideasPlus,
			ideasMinus: idea.ideasMinus,
			comments: idea.comments,
			alternatives: idea.alternatives,
			implementations: idea.implementations,

			createdAt: idea.createdAt,
		};
	}

	/**
	 * Сохраняет голос за идею
	 *
	 * @param {User} user
	 * @param {string} ideaId
	 * @param {number} voteType
	 */
	async vote (user: User, ideaId: string, voteType: number) {
		return await ORM.Idea.vote(ObjectId(ideaId), user._id, voteType);
	}
}
