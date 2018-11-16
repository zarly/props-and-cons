
import {Idea} from '../orm/idea'
import {User} from '../orm/user'
import ORM, {ObjectId, MongoIdType} from '../orm'
import {IdeaForDetails} from '../rest_interfaces/idea_for_details'

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
			type: raw.type,
			title: raw.title,
			description: raw.description,

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
	 * @returns {Array<Idea>}
	 */
	async getIdeasList (realm: string, user?: User, limit: number = 10, skip: number = 0) : Promise<{count: number, rows: Idea[]}> {
		const filter : any = {
			realm: realm,
			parentIdea: null,
		};
		const count = await ORM.Idea.countDocuments(filter);
		const rows = await ORM.Idea.find(filter).sort([['createdAt', -1]]).skip(skip).limit(limit);
		return {count, rows};
	}

	/**
	 * Возвращает информацию об идее по её id
	 *
	 * @param {String} realm
	 * @param {User} user
	 * @param {string} id
	 * @returns {Promise<IdeaForDetails>}
	 */
	async getIdeaById (realm: string, user: User, id: string) : Promise<IdeaForDetails> {
		const idea = await ORM.Idea.readWithChildren(id);
		const author = await ORM.User.publicInfo(idea.author);
		const myVote = await this.getUserVoteForIdea(user._id, id);

		return {
			_id: idea._id,
			type: idea.type,
			title: idea.title,
			description: idea.description,

			author: author,
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
	 * @param {MongoIdType} userId
	 * @param {MongoIdType} ideaId
	 * @param {number} voteType
	 */
	async vote (userId: MongoIdType, ideaId: MongoIdType, voteType: number) {
		return await Promise.all([
			ORM.Idea.vote(userId, ideaId, voteType),
			ORM.User.vote(userId, ideaId, voteType)
		]);
	}

	async getUserVoteForIdea (userId: MongoIdType, ideaId: MongoIdType) {
		const user = await ORM.User.findOne({
			_id: userId,
			'votes.ideaId': ''+ideaId,
		}, {
			votes: true,
		});

		const vote = user && user.votes && user.votes[0];
		const voteType = vote && vote.voteType;
		return voteType || 0;
	}
}
