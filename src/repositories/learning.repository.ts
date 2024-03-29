import { FilterQuery, UpdateQuery } from "mongoose";
import Learning, { ILearning } from "../models/learning.model";
import LearningInterface from "./interfaces/learning.interface";

export default class LearningRepository implements LearningInterface {
  public constructor(private learningModel: typeof Learning) {}

  public findAll() {
    return this.learningModel.find().exec();
  }

  public findById(id: string) {
    return this.learningModel.findById(id).exec();
  }

  public findByAccountId(id: string) {
    return this.learningModel.findOne({ accountId: id }).exec();
  }

  public findOne(filter: FilterQuery<ILearning>): Promise<unknown> {
    return this.learningModel.findOne(filter).exec();
  }

  public create(payload: ILearning): Promise<unknown> {
    return this.learningModel.create(payload);
  }

  public updateById(
    id: string,
    updatedData: UpdateQuery<ILearning>,
  ): Promise<unknown> {
    return this.learningModel.findByIdAndUpdate(id, updatedData).exec();
  }

  public deleteById(id: string) {
    return this.learningModel.findByIdAndDelete(id).exec();
  }
}
