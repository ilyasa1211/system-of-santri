import { AnyKeys, FilterQuery, UpdateQuery } from "mongoose";
import Resume from "../models/resume.model";
import { IWork } from "../models/work.model";
import ResumeInterface from "./interfaces/resume.interface";

export default class ResumeRepository implements ResumeInterface {
  public constructor(private resumeModel: typeof Resume) {}

  public findAll() {
    return this.resumeModel.find().exec();
  }

  public findById(id: string) {
    return this.resumeModel.findById(id).exec();
  }

  public findByAccountId(id: string) {
    return this.resumeModel.findOne({ accountId: id }).exec();
  }

  public insert(data: Record<string, unknown>) {
    return this.resumeModel.create(data);
  }

  public updateById(id: string, updatedData: Record<string, unknown>) {
    return this.resumeModel.findByIdAndUpdate(id, updatedData).exec();
  }

  public deleteById(id: string) {
    return this.resumeModel.findByIdAndDelete(id).exec();
  }

  public isExist(filter: Record<string, unknown>) {
    return this.resumeModel.exists(filter).exec();
  }
}
