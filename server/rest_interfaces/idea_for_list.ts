
export interface IdeaForList {
	_id: string;
	title: string;
	description: string;

	votesPlus: number;
	votesMinus: number;
	skips: number;
	views: number;

	ideasPlusCount: number;
	ideasMinusCount: number;
	commentsCount: number;
	alternativesCount: number;
	implementationsCount: number;

	createdAt: number;
}
