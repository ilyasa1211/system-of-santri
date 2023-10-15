import { FilterQuery, UpdateQuery } from "mongoose";
import { INote } from "../../models/note.model";
import { AnyKeys } from "mongoose";

export default interface NoteInterface {
    findAll(): any;
    findById(id: string): any;
    insert(data: AnyKeys<INote>): any;
    updateById(id: string, updatedData: UpdateQuery<INote>): any;
    deleteById(id: string): any;
}
