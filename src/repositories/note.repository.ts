import { AnyKeys, FilterQuery, UpdateQuery } from "mongoose";
import Note from "../models/note.model";
import { INote } from "../models/note.model";
import NoteInterface from "./interfaces/note.interface";
import { IResume } from "../models/resume.model";
import { IWork } from "../models/work.model";

export default class NoteRepository implements NoteInterface {
  public constructor(private noteModel: typeof Note) {}

  public findAll() {
    return this.noteModel.find().exec();
  }

  public findById(id: string) {
    return this.noteModel.findById(id).exec();
  }

  public create(payload: INote) {
    return this.noteModel.create(payload);
  }

  public updateById(id: string, updateData: UpdateQuery<INote>) {
    return this.noteModel.findByIdAndUpdate(id, updateData).exec();
  }

  public deleteById(id: string) {
    return this.noteModel.findByIdAndDelete(id).exec();
  }

  public isExist(filter: FilterQuery<INote>) {
    return this.noteModel.exists(filter).exec();
  }
}
