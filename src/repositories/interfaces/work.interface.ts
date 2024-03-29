import { SortOrder, UpdateQuery } from "mongoose";
import { IWork } from "../../models/work.model";

// TODO: change Promise<unknown>   to something
export default interface WorkInterface {
  findAll(): Promise<unknown>;
  findAllSortBy(column: keyof IWork, order: SortOrder): Promise<unknown>;
  findById(id: string): Promise<unknown>;
  findBy(colum: keyof IWork, value: unknown): Promise<unknown>;
  create(payload: Partial<IWork>): Promise<unknown>;
  updateById(id: string, updatedData: UpdateQuery<IWork>): Promise<unknown>;
  deleteById(id: string): Promise<unknown>;
}
