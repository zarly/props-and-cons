
import Idea from '../models/idea'

export class Gate {
	constructor (apiUrl) {
		this.apiUrl = apiUrl;
	}

	async ask (path, options) {
		const res = await fetch(this.apiUrl + path, options);
		if (res.status >= 400) {
			return Promise.reject(res);
		}
		return await res.json();
	}

	async getIdeasList (skip = 0, parentId, ideaType) {
		let url = `/ideas?skip=${skip}`;
		if (parentId) url += `&parentId=${parentId}`;
		if (ideaType) url += `&type=${ideaType}`;

		const response = await this.ask(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		});
		response.rows = response.rows.map(Idea);
		return response;
	}

	async getIdeaChildren (skip = 0, parentId, ideaType) {
		let url = `/ideas/children?skip=${skip}`;
		if (parentId) url += `&parentId=${parentId}`;
		if (ideaType) url += `&type=${ideaType}`;

		const response = await this.ask(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		});
		return response.map(Idea);
	}

	async getIdea (ideaId) {
		const idea = await this.ask(`/ideas/${ideaId}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		});
		return Idea(idea);
	}

	async createIdea (json) {
		return await this.ask(`/ideas`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(json),
		});
	}

	async deleteIdea (ideaId) {
		return await this.ask(`/ideas/${ideaId}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'DELETE',
		});
	}

	async vote (ideaId, voteType) {
		const query = {
			ideaId,
			voteType,
		};
		return await this.ask('/vote', {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(query),
		});
	}
}

export default new Gate('/api');
