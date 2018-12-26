
import {renderDatetime} from '../modules/decorators'

function Idea (json) {
	Object.setPrototypeOf(json, Idea.prototype); // TODO: проверить через caniuse

	if (json.comments) json.comments = json.comments.map(Idea);
	if (json.ideasPlus) json.ideasPlus = json.ideasPlus.map(Idea);
	if (json.ideasMinus) json.ideasMinus = json.ideasMinus.map(Idea);

	return json;
}

Idea.prototype = {
	get authorUrl () {
		return this.author ? `https://vk.com/id${this.author.vkUid}` : undefined;
	},
	get authorPhoto () {
		return this.author ? this.author.photo : undefined;
	},
	get authorName () {
		return this.author ? this.author.name : undefined;
	},
	get authorId () {
		return this.author ? this.author._id : undefined;
	},
	get responsesTotal () {
		return this.commentsCount
			+ this.ideasPlusCount + this.ideasMinusCount;
	},
	get prettyUpdatedDate () {
		if (!this.updatedAt) return '-';

		const date = new Date(this.updatedAt);
		return renderDatetime(date);
	},
	get prettyCreatedDate () {
		if (!this.createdAt) return '-';

		const date = new Date(this.createdAt);
		return renderDatetime(date);
	},
	isAllowedRemove (user) {
		if (!user) return false;

		const isAuthor = this.authorId === user._id;
		const isAdmin = [2, 3, 4].indexOf(user.role) !== -1;
		return isAuthor || isAdmin;
	},
};

export default Idea;
