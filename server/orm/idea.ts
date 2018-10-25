
import { prop, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

@pre<Idea>('save', function(next) { // or @pre(this: Car, 'save', ...
    console.log('Pre save', this.title, this.id, this.parentIdea, this.comments);
    if (this.parentIdea) {
        IdeaModel.update({
            _id: this.parentIdea
        }, {
            $push: {
                comments: this._id
            }
        }, next);
    } else {
        next();
    }
})
export class Idea extends Typegoose {
    id: any;

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

    @prop()
    votesPlus: Array<string>;
    @prop()
    votesMinus: Array<string>;
    @prop()
    skips: Array<string>;
    @prop()
    views: Array<string>;

    @prop({ref: 'Idea', default: []})
    ideasPlus: Array<mongoose.Types.ObjectId>;
    @prop({ref: 'Idea', default: []})
    ideasMinus: Array<mongoose.Types.ObjectId>;
    @prop({ref: 'Idea', default: []})
    alternatives: Array<mongoose.Types.ObjectId>;
    @prop({ref: 'Idea', default: []})
    comments: Array<mongoose.Types.ObjectId>;
}

const IdeaModel = new Idea().getModelForClass(Idea);

export default IdeaModel;
