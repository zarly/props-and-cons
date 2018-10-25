
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose'
import * as mongoose from 'mongoose'

export class Idea extends Typegoose {
    id: any;

    @prop()
    title: string;
}

export default new Idea().getModelForClass(Idea);
