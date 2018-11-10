
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
}

export default new Gate('/api');
