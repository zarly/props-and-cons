
import {Idea} from '../orm/idea'
import ORM from '../orm'

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
	publishIdea (idea: Idea) {

	}

	/**
	 * Возвращает список идей
	 *
	 * @returns {Array<Idea>}
	 */
	getIdeasList () : Array<Idea> {
		return [];
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
