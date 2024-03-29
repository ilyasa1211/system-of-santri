import { AnyKeys, FilterQuery, SortOrder, UpdateQuery } from "mongoose";
import Resume, { IResume } from "../models/resume.model";
import ResumeInterface from "./interfaces/resume.interface";

export default class ResumeRepository implements ResumeInterface {
  public constructor(private model: typeof Resume) {}

  public findAll() {
    return this.model.find().exec();
  }

  public findAllSortBy(
    column: keyof IResume,
    order: SortOrder,
  ): Promise<unknown> {
    const sortColumn: Partial<Record<keyof IResume, SortOrder>> = {};
    Object.defineProperty(sortColumn, column, { value: order });

    return this.model.find().sort(sortColumn).exec();
  }

  public findBy(column: keyof IResume, value: unknown): Promise<unknown> {
    const filterQuery: Partial<IResume> = {};

    Object.defineProperty(filterQuery, column, { value });

    return this.model.findOne(filterQuery).exec();
  }

  public findById(id: string) {
    return this.model.findById(id).exec();
  }

  public findByAccountId(id: string) {
    return this.model.findOne({ accountId: id }).exec();
  }

  public create(payload: IResume): Promise<unknown> {
    return this.model.create(payload);
  }

  public updateById(id: string, updatedData: UpdateQuery<IResume>) {
    return this.model.findByIdAndUpdate(id, updatedData).exec();
  }

  public deleteById(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }

  public isExist(filter: FilterQuery<IResume>) {
    return this.model.exists(filter).exec();
  }
}
