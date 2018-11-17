
import { prop, arrayProp, instanceMethod, staticMethod, pre, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'
import {RootIdeaType, IdeaType, VoteType} from './_enums'
import {IdeaForList} from '../rest_interfaces/idea_for_list'

type ObjectId = mongoose.Types.ObjectId;
export type MongoIdType = string | mongoose.Types.ObjectId;

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

    @arrayProp({items: mongoose.Types.ObjectId, 'default': []})
    votesPlus: Array<ObjectId>;
	@arrayProp({items: mongoose.Types.ObjectId, 'default': []})
    votesMinus: Array<ObjectId>;
	@arrayProp({items: mongoose.Types.ObjectId, 'default': []})
    skips: Array<ObjectId>;
	@arrayProp({items: mongoose.Types.ObjectId, 'default': []})
	views: Array<ObjectId>;
	@arrayProp({items: mongoose.Types.ObjectId, 'default': []})
	reports: Array<ObjectId>;

	@arrayProp({itemsRef: Idea, 'default': []})
    ideasPlus: Array<ObjectId>;
	@arrayProp({itemsRef: Idea, 'default': []})
    ideasMinus: Array<ObjectId>;
	@arrayProp({itemsRef: Idea, 'default': []})
    alternatives: Array<ObjectId>;
	@arrayProp({itemsRef: Idea, 'default': []})
	comments: Array<ObjectId>;
	@arrayProp({itemsRef: Idea, 'default': []})
	implementations: Array<ObjectId>;

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
	static async readWithChildren (userId: MongoIdType, ideaId: MongoIdType, childrenLimit: number = 10) : Promise<any> {
		const rows = await Model.aggregate([{
			$match: {
				_id: ('string' === typeof ideaId) ? mongoose.Types.ObjectId(<string>ideaId) : ideaId,
			}
		}, {
			$project: {
				type: 1,
				title: 1,
				description: 1,

				author: 1,
				parentIdeas: 1,

				votesPlusCount: {$size: "$votesPlus"},
				votesMinusCount: {$size: "$votesMinus"},
				skipsCount: {$size: "$skips"},
				viewsCount: {$size: "$views"},
				reportsCount: {$size: "$reports"},

				myVote: {
					$switch: {
						branches: [
							{'case': {$in: [userId, '$skips']}, then: VoteType.skip},
							{'case': {$in: [userId, '$votesPlus']}, then: VoteType.plus},
							{'case': {$in: [userId, '$votesMinus']}, then: VoteType.minus},
						],
						'default': 0
					}
				},

				ideasPlus: {
					$slice: ['$ideasPlus', 0, childrenLimit]
				},
				ideasMinus: {
					$slice: ['$ideasMinus', 0, childrenLimit]
				},
				comments: {
					$slice: ['$comments', 0, childrenLimit]
				},
				alternatives: {
					$slice: ['$alternatives', 0, childrenLimit]
				},
				implementations: {
					$slice: ['$implementations', 0, childrenLimit]
				},

				ideasPlusCount: {$size: "$ideasPlus"},
				ideasMinusCount: {$size: "$ideasMinus"},
				commentsCount: {$size: "$comments"},
				alternativesCount: {$size: "$alternatives"},
				implementationsCount: {$size: "$implementations"},

				createdAt: 1,
			}
		}]);
		return rows[0] || null;
	}

	@staticMethod
	static async readDetails (id: MongoIdType, userId: MongoIdType = '222') : Promise<any> {
		const records = await Model.aggregate([{
			$match: {
				_id: id,
			}
		}, {
			$project: {
				votesPlusCount: {$size: "$votesPlus"},
				votesMinusCount: {$size: "$votesMinus"},
				skipsCount: {$size: "$skips"},
				viewsCount: {$size: "$views"},
				reportsCount: {$size: "$reports"},

				isVotedPlus: {
					$size: {
						$filter: {
							input: "$votesPlus",
							as: "item",
							cond: {$eq: ['$$item', userId]}
						}
					}
				},
			},
		}]);
		return records[0] || null;
	}

	@staticMethod
	static async resolveIdeas (ids: Array<ObjectId>) : Promise<IdeaForList[]> {
		const commentsPromise = ids
			.map((id: ObjectId) => {
				return Model.findById(id);
			});
		return <any[]>(await Promise.all(<any[]>commentsPromise));
	}

	@staticMethod
	static vote (userId: MongoIdType, ideaId: MongoIdType, voteType: VoteType) {
		const typeToArrayNameMap: {[index:string]:keyof Idea} = {
			[VoteType.view]: 'views',
			[VoteType.skip]: 'skips',
			[VoteType.plus]: 'votesPlus',
			[VoteType.minus]: 'votesMinus',
			[VoteType.report]: 'reports',
		};
		const pullNameMap: {[index:string]:any} = {
			[VoteType.view]: {
				skips: userId,
				votesPlus: userId,
				votesMinus: userId,
				reports: userId,
			},
			[VoteType.skip]:  {
				views: userId,
				votesPlus: userId,
				votesMinus: userId,
				reports: userId,
			},
			[VoteType.plus]:  {
				views: userId,
				skips: userId,
				votesMinus: userId,
				reports: userId,
			},
			[VoteType.minus]:  {
				views: userId,
				skips: userId,
				votesPlus: userId,
				reports: userId,
			},
			[VoteType.report]:  {
				views: userId,
				skips: userId,
				votesPlus: userId,
				votesMinus: userId,
			},
		};
		return new Promise((resolve, reject) => {
			const arrayName = typeToArrayNameMap[voteType];
			Model.updateOne({
				_id: ideaId
			}, {
				$addToSet: {
					[arrayName]: userId
				},
				$pull: pullNameMap[voteType],
			}, (err: any, res: any) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	}
}

const Model = new Idea().getModelForClass(Idea);

export default Model;
