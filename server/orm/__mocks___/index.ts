
export default class ORM {
	private credentials: string;
	static User: any;
	static Group: any;
	static Idea: any;
	static IdeaTypes: any;

	constructor (credentials: string) {}

	async connect () {}

	async disconnect () {}

	async getFreshIdeas (user: any) : Promise<{count: number, rows: any[]}> {
		return {
			count: 0,
			rows: [],
		};
    }

	async getIdeasList (user?: any, limit: number = 10, shift: number = 0) : Promise<{count: number, rows: any[]}> {
		return {
			count: 0,
			rows: [],
		};
	}
}
