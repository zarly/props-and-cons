
import {IdeaForList} from './idea_for_list';

export interface IdeaForDetails {
	_id: string;
	type: number;
	title: string;
	description: string;

	author: string;
	parentIdeas: Array<String>;

	votesPlus: number;
	votesMinus: number;
	skips: number;
	views: number;

	ideasPlusCount: number;
	ideasMinusCount: number;
	commentsCount: number;
	alternativesCount: number;
	implementationsCount: number;

	ideasPlus: Array<IdeaForList>;
	ideasMinus: Array<IdeaForList>;
	comments: Array<IdeaForList>;
	alternatives: Array<IdeaForList>;
	implementations: Array<IdeaForList>;

	createdAt: number;
}
