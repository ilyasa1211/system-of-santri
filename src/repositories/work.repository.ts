import { AnyKeys, FilterQuery, Model, SortOrder, UpdateQuery } from "mongoose";
import Work, { IWork } from "../models/work.model";
import WorkInterface from "./interfaces/work.interface";

export default class WorkRepository implements WorkInterface {
  public constructor(private model: Model<IWork>) {}

  public findAll() {
    return this.model.find().exec();
  }

  public findAllSortBy(column: keyof IWork, order: SortOrder) {
    const sortColumn: Partial<Record<keyof IWork, SortOrder>> = {};
    Object.defineProperty(sortColumn, column, { value: order });

    return this.model.find().sort(sortColumn).exec();
  }

  public findById(id: string) {
    return this.model.findById(id).exec();
  }

  public findBy(column: keyof IWork, value: unknown) {
    const filterQuery: Partial<IWork> = {};

    Object.defineProperty(filterQuery, column, { value });

    return this.model.findOne(filterQuery).exec();
  }

  public create(payload: Partial<IWork>) {
    return this.model.create(payload);
  }

  public updateById(id: string, updatedData: UpdateQuery<IWork>) {
    return this.model.findByIdAndUpdate(id, updatedData).exec();
  }

  public deleteById(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }
}
