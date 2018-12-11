
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
