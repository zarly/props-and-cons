
export enum RootIdeaType {
}

export enum IdeaType {
	// Child types
	comment = 1,
	alternative = 2,
	plus = 3,
	minus = 4,
	implementation = 5,

	// Root types
	information = 101, 	// правда-ложь
	action = 102,		// за-против
	question = 103,	 	// актуально или нет, варианты ответов, одна колонка
	category = 104,
}

export enum VoteType {
	none = 0,
	view = 1,
	skip = 2,
	plus = 3,
	minus = 4,
	report = 5,
}
