import { AnyKeys, UpdateQuery } from "mongoose";
import { IWork } from "../../models/work.model";
import { FilterQuery } from "mongoose";

export default interface ResumeInterface {
  findAll(): any;
  findById(id: string): any;
  findByAccountId(id: string): any;
  insert(data: Record<string, unknown>): any;
  updateById(id: string, updatedData: Record<string, unknown>): any;
  deleteById(id: string): any;
  isExist(filter: FilterQuery<IWork>): any;
}
