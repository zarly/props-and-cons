
import {renderDatetime} from '../modules/decorators'

function Idea (json) {
	Object.setPrototypeOf(json, Idea.prototype); // TODO: проверить через caniuse

	if (json.comments) json.comments = json.comments.map(Idea);
	if (json.ideasPlus) json.ideasPlus = json.ideasPlus.map(Idea);
	if (json.ideasMinus) json.ideasMinus = json.ideasMinus.map(Idea);
	if (json.alternatives) json.alternatives = json.alternatives.map(Idea);
	if (json.implementations) json.implementations = json.implementations.map(Idea);

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
	get responsesTotal () {
		return this.commentsCount
			+ this.ideasPlusCount + this.ideasMinusCount
			+ this.alternativesCount + this.implementationsCount;
	},
	get prettyUpdatedDate () {
		const date = new Date(this.updatedAt);
		return renderDatetime(date);
	},
	get prettyCreatedDate () {
		const date = new Date(this.createdAt);
		return renderDatetime(date);
	},
};

export default Idea;
