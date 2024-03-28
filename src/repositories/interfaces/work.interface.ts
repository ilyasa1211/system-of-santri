import { AnyKeys, FilterQuery, UpdateQuery } from "mongoose";
import { IWork } from "../../models/work.model";

export default interface WorkInterface {
  findAll(): any;
  findOne(filter: FilterQuery<IWork>): any;
  findById(id: string): any;
  findByAccountId(id: string): any;
  insert(data: Record<string, unknown>): any;
  updateById(id: string, updatedData: Record<string, unknown>): any;
  deleteById(id: string): any;
}
