
export default {
    _id: '1',
    title: 'Заголовок идеи',
    description: 'Подробное описание идеи',

	author: 'alex',
	parentIdeas: [{_id: 1, title: 'Идея-категория'}, {_id: 1, title: 'Идея-родитель'}],

	votesPlus: 25,
	votesMinus: 23,
	skips: 55,
	views: 120,

	ideasPlusCount: 2,
	ideasMinusCount: 3,
	commentsCount: 2,

	ideasPlus: [{_id: 2, title: 'Аргумент за 1'}, {_id: 3, title: 'Аргумент за 2'}],
	ideasMinus: [{_id: 4, title: 'Аргумент против 1'}, {_id: 5, title: 'Аргумент против 2 '}, {_id: 6, title: 'Аргумент против 3'}],
	comments: [{_id: 7, title: 'Комментарий 1'}, {_id: 8, title: 'Комментарий 2'}],

	createdAt: 1541255049845
}
