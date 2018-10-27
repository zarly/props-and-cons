
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

export enum IdeaType {
	comment = 1,
	alternative = 2,
	plus = 3,
	minus = 4,
	implementation = 5,
}

export enum VoteType {
	view = 1,
	skip = 2,
	plus = 3,
	minus = 4,
	report = 5,
}

export class Idea extends Typegoose {
	_id: mongoose.Types.ObjectId;

    @prop({'default': IdeaType.comment})
    type: IdeaType;
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
	@arrayProp({items: mongoose.Types.ObjectId})
	reports: Array<mongoose.Types.ObjectId>;

	@arrayProp({itemsRef: Idea})
    ideasPlus: Array<mongoose.Types.ObjectId>;
	@arrayProp({itemsRef: Idea})
    ideasMinus: Array<mongoose.Types.ObjectId>;
	@arrayProp({itemsRef: Idea})
    alternatives: Array<mongoose.Types.ObjectId>;
	@arrayProp({itemsRef: Idea})
	comments: Array<mongoose.Types.ObjectId>;
	@arrayProp({itemsRef: Idea})
	implementations: Array<mongoose.Types.ObjectId>;

	@instanceMethod
	registerInParent () {
		const typeToArrayNameMap = {
			[IdeaType.comment]: 'comments',
			[IdeaType.alternative]: 'alternatives',
			[IdeaType.plus]: 'ideasPlus',
			[IdeaType.minus]: 'ideasMinus',
			[IdeaType.implementation]: 'implementations',
		};
		return new Promise((resolve, reject) => {
			if (!this.parentIdea) return resolve(false);

			const arrayName = typeToArrayNameMap[this.type];
			IdeaModel.updateOne({
				_id: this.parentIdea
			}, {
				$push: {
					[arrayName]: this._id
				}
			}, (err: any, res: any) => {
				if (err) reject(err);
				resolve(res.result);
			});
		});
	}

	@staticMethod
	static async createAndRegister (json: any) {
		const instance = new IdeaModel(json);
		await instance.save();
		await instance.registerInParent();
		return instance;
	}

	@staticMethod
	static async readWithChildren (id: mongoose.Types.ObjectId, limit: number = 10) : Promise<any> {
		const result = await IdeaModel.findById(id);
		result.comments = await IdeaModel.resolveIdeas(result.comments, limit);
		result.alternatives = await IdeaModel.resolveIdeas(result.alternatives, limit);
		result.ideasPlus = await IdeaModel.resolveIdeas(result.ideasPlus, limit);
		result.ideasMinus = await IdeaModel.resolveIdeas(result.ideasMinus, limit);
		result.implementations = await IdeaModel.resolveIdeas(result.implementations, limit);
		return result;
	}

	@staticMethod
	static async resolveIdeas (ids: Array<mongoose.Types.ObjectId>, limit: number = 10) : Promise<any> {
		const commentsPromise = ids
			.slice(0, limit)
			.map((id: mongoose.Types.ObjectId) => {
				return IdeaModel.findById(id);
			});
		return <any>(await Promise.all(<any>commentsPromise));
	}

	@staticMethod
	static async vote (ideaId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, voteType: VoteType) {
		const typeToArrayNameMap = {
			[VoteType.view]: 'views',
			[VoteType.skip]: 'skips',
			[VoteType.plus]: 'votesPlus',
			[VoteType.minus]: 'votesMinus',
			[VoteType.report]: 'reports',
		};
		return new Promise((resolve, reject) => {
			const arrayName = typeToArrayNameMap[voteType];
			IdeaModel.updateOne({
				_id: ideaId
			}, {
				$push: {
					[arrayName]: userId
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
