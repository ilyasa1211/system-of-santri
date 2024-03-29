import { FilterQuery, UpdateQuery } from "mongoose";
import { INote } from "../../models/note.model";
import { AnyKeys } from "mongoose";

export default interface NoteInterface {
  findAll(): Promise<unknown>;
  findById(id: string): Promise<unknown>;
  create(data: AnyKeys<INote>): Promise<unknown>;
  updateById(id: string, updatedData: UpdateQuery<INote>): Promise<unknown>;
  deleteById(id: string): Promise<unknown>;
  isExist(filter: FilterQuery<INote>): Promise<unknown>;
}
