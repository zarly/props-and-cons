
import {Idea} from '../orm/idea'
import {User} from '../orm/user'
import ORM, {ObjectId, MongoIdType} from '../orm'
import {IdeaForDetails} from '../rest_interfaces/idea_for_details'
import {IdeaForList} from '../rest_interfaces/idea_for_list'

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
	 * @returns {Array<Idea>}
	 */
	async getIdeasList (realm: string, user?: User, limit: number = 10, skip: number = 0) : Promise<{count: number, rows: IdeaForList[]}> {
		const filter : any = {
			realm: realm,
			parentIdea: null,
		};
		const count = await ORM.Idea.countDocuments(filter);
		const rows = await ORM.Idea.aggregate([{
			$match: filter
		}, {
			$project: {
				title: 1,
				description: 1,

				votesPlus: {$size: '$votesPlus'},
				votesMinus: {$size: '$votesMinus'},
				skips: {$size: '$skips'},
				views: {$size: '$views'},
				reports: {$size: '$reports'},

				ideasPlusCount: {$size: '$ideasPlus'},
				ideasMinusCount: {$size: '$ideasMinus'},
				commentsCount: {$size: '$comments'},
				alternativesCount: {$size: '$alternatives'},
				implementationsCount: {$size: '$implementations'},

				createdAt: 1,
			}
		}, {
			$sort: {createdAt: -1}
		}]).skip(skip).limit(limit);
		return {
			count,
			rows: <any[]>rows,
		};
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
	async vote (userId: MongoIdType, ideaId: MongoIdType, voteType: number) {
		return await ORM.Idea.voteAndReturnNewValues(userId, ideaId, voteType);
	}
}
