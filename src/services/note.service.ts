import { BadRequestError, NotFoundError } from "../errors/errors";
import { ResponseMessage } from "../enums/response";
import Note from "../models/note.model";
import NoteRepository from "../repositories/note.repository";
import { HydratedDocument } from "mongoose";
import { IAccount } from "../models/account.model";

type NotePayload = Request["body"] & {
  noteId: string;
  note: string;
  learningId: string;
};

// TODO: Add authorization
export default class NoteService {
  public constructor(
    private repository: NoteRepository,
    private model: typeof Note,
  ) {}

  public async findAll() {
    const notes = await this.repository.findAll();
    return notes;
  }
  public async findId(noteId: string) {
    const note = await this.repository.findById(noteId);
    return note;
  }
  public async create(payload: NotePayload, user: HydratedDocument<IAccount>) {
    const { noteId, note, learningId } = payload;

    if (!learningId) {
      throw new BadRequestError(ResponseMessage.INVALID_LEARNING_ID);
    }
    if (!note) {
      throw new BadRequestError(ResponseMessage.NOTE_REQUIRED);
    }

    const isNoteExists = await this.repository.isExist({ _id: noteId });

    if (!isNoteExists) {
      throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
    }

    const createdNote = await this.model.create(payload);

    return createdNote;
  }

  public async updateId(
    noteId: string,
    payload: Record<string, unknown>,
    user: HydratedDocument<IAccount>,
  ) {
    const updatedNote = await this.repository.updateById(noteId, payload);
    return updatedNote;
  }
  public async deleteId(noteId: string, user: HydratedDocument<IAccount>) {
    const deletedNote = await this.model.findByIdAndDelete(noteId);
    return deletedNote;
  }
}
