import { AnyKeys, FilterQuery, UpdateQuery } from "mongoose";
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

  public findOne(filter: Record<string, unknown>) {
    return this.learningModel.findOne(filter).exec();
  }

  public insert(data: Record<string, unknown>) {
    return this.learningModel.create(data);
  }

  public updateById(id: string, updatedData: Record<string, unknown>) {
    return this.learningModel.findByIdAndUpdate(id, updatedData).exec();
  }

  public deleteById(id: string) {
    return this.learningModel.findByIdAndDelete(id).exec();
  }
}
