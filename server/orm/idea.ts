
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

type ObjectId = mongoose.Types.ObjectId;

export enum RootIdeaType {
	information = 1, // правда-ложь
	action = 2,		 // за-против
	question = 3,	 // актуально или нет, варианты ответов
	category = 4,
}

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
	_id: ObjectId;

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
    realm: string;
    @prop({})
    author: ObjectId;
    @prop({ref: 'Idea'})
    parentIdea: ObjectId;

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

    @prop({required: true, 'default': Date.now})
	createdAt: number;

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
			Model.updateOne({
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
		const instance = new Model(json);
		await instance.save();
		await instance.registerInParent();
		return instance;
	}

	@staticMethod
	static async readWithChildren (id: string|mongoose.Types.ObjectId, limit: number = 10) : Promise<any> {
		const result = await Model.findById(id);
		if (!result) return null;

		result.parentIdea = <any>(await Model.findById(result.parentIdea, ['title']));

		result.comments = await Model.resolveIdeas(result.comments, limit);
		result.alternatives = await Model.resolveIdeas(result.alternatives, limit);
		result.ideasPlus = await Model.resolveIdeas(result.ideasPlus, limit);
		result.ideasMinus = await Model.resolveIdeas(result.ideasMinus, limit);
		result.implementations = await Model.resolveIdeas(result.implementations, limit);
		
		return result;
	}

	@staticMethod
	static async resolveIdeas (ids: Array<mongoose.Types.ObjectId>, limit: number = 10) : Promise<any> {
		const commentsPromise = ids
			.slice(0, limit)
			.map((id: mongoose.Types.ObjectId) => {
				return Model.findById(id);
			});
		return <any>(await Promise.all(<any>commentsPromise));
	}

	@staticMethod
	static vote (ideaId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, voteType: VoteType) {
		const typeToArrayNameMap = {
			[VoteType.view]: 'views',
			[VoteType.skip]: 'skips',
			[VoteType.plus]: 'votesPlus',
			[VoteType.minus]: 'votesMinus',
			[VoteType.report]: 'reports',
		};
		return new Promise((resolve, reject) => {
			const arrayName = typeToArrayNameMap[voteType];
			Model.updateOne({
				_id: ideaId
			}, {
				$push: {
					[arrayName]: userId
				}
			}, (err: any, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	}
}

const Model = new Idea().getModelForClass(Idea);

export default Model;
