
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

// @pre<Idea>('save', function(next) { // or @pre(this: Car, 'save', ...
//     console.log('Pre save', this.title, this.id, this.parentIdea, this.comments);
//     if (this.parentIdea) {
//         IdeaModel.update({
//             _id: this.parentIdea
//         }, {
//             $push: {
//                 comments: this._id
//             }
//         }, next);
//     } else {
//         next();
//     }
// })
export class Idea extends Typegoose {
	_id: mongoose.Types.ObjectId;

    @prop()
    type: string;
    @prop()
    title: string;
    @prop()
    description: string;
    @prop()
    details: string;
    @prop()
    attachements: Array<Object>;

    @prop({})
    author: mongoose.Types.ObjectId;
    @prop({ref: 'Idea'})
    parentIdea: mongoose.Types.ObjectId;

    @prop()
    voteType: string;
    @prop()
    availableActions: Array<string>;

    @arrayProp({items: mongoose.Types.ObjectId})
    votesPlus: Array<mongoose.Types.ObjectId>;
	@arrayProp({items: mongoose.Types.ObjectId})
    votesMinus: Array<mongoose.Types.ObjectId>;
	@arrayProp({items: mongoose.Types.ObjectId})
    skips: Array<mongoose.Types.ObjectId>;
	@arrayProp({items: mongoose.Types.ObjectId})
    views: Array<mongoose.Types.ObjectId>;

	@arrayProp({itemsRef: Idea})
    ideasPlus: Array<mongoose.Types.ObjectId>;
	@arrayProp({itemsRef: Idea})
    ideasMinus: Array<mongoose.Types.ObjectId>;
	@arrayProp({itemsRef: Idea})
    alternatives: Array<mongoose.Types.ObjectId>;
	@arrayProp({itemsRef: Idea})
    comments: Array<mongoose.Types.ObjectId>;

	@instanceMethod
	registerInParent () {
		return new Promise((resolve, reject) => {
			IdeaModel.update({
				_id: this.parentIdea
			}, {
				$push: {
					comments: this._id
				}
			}, (err: any, res: any) => {
				if (err) reject(err);
				resolve(res.result);
			});
		});
	}
}

const IdeaModel = new Idea().getModelForClass(Idea);

export default IdeaModel;
