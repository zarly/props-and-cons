
export enum RootIdeaType {
	information = 1, // правда-ложь
	action = 2,		 // за-против
	question = 3,	 // актуально или нет, варианты ответов
	category = 4,
}

export enum IdeaType {
	comment = 1,
	alternative = 2,
	plus = 3,
	minus = 4,
	implementation = 5,
}

export enum VoteType {
	none = 0,
	view = 1,
	skip = 2,
	plus = 3,
	minus = 4,
	report = 5,
}
