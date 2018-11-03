
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
		return idea;
	}

	/**
	 * Сохраняет голос за идею
	 *
	 * @param {string} ideaId
	 * @param {number} voteType
	 */
	vote (ideaId: string, voteType: number) {

	}
}
