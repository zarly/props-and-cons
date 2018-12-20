
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

	async getIdeasList (skip = 0) {
		const response = await this.ask(`/ideas?skip=${skip}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		});
		response.rows = response.rows.map(Idea);
		return response;
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
