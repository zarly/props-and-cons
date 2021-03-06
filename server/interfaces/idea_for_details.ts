
import {IdeaForList} from './idea_for_list';

export interface IdeaForDetails {
	_id: string;
	type: number;
	title: string;
	description: string;

	author: any;
	parentIdeas: Array<String>;

	votesPlusCount: number;
	votesMinusCount: number;
	skipsCount: number;
	viewsCount: number;
	reportsCount: number;

	voteRating: number;
	myVote: number;

	ideasPlus: Array<IdeaForList>;
	ideasMinus: Array<IdeaForList>;
	comments: Array<IdeaForList>;

	ideasPlusCount: number;
	ideasMinusCount: number;
	commentsCount: number;

	createdAt: number;
}
