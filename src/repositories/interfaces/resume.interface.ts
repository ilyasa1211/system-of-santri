import { SortOrder, UpdateQuery } from "mongoose";
import { FilterQuery } from "mongoose";
import { IResume } from "../../models/resume.model";

export default interface ResumeInterface {
  findAll(): Promise<unknown>;
  findAllSortBy(column: keyof IResume, order: SortOrder): Promise<unknown>;
  findById(id: string): Promise<unknown>;
  findBy(column: keyof IResume, value: unknown): Promise<unknown>;
  create(payload: IResume): Promise<unknown>;
  updateById(id: string, updatedData: UpdateQuery<IResume>): Promise<unknown>;
  deleteById(id: string): Promise<unknown>;
  isExist(filter: FilterQuery<IResume>): Promise<unknown>;
}
