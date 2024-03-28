import { Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import NoteService from "../services/note.service";
import Note from "../models/note.model";
import { IAccount } from "../models/account.model";
import { HydratedDocument } from "mongoose";

export class NoteController {

  public constructor(
    private readonly noteService: NoteService,
    private readonly apiResponse: ApiResponse,
  ) { }

  public async index(request: Request) {
    const notes = await this.noteService.getAllNotes();
    return this.apiResponse.ok({ notes });
  }
  public async show(request: Request) {
    const { noteId } = request.params;
    const note = await this.noteService.getNoteById(noteId);

    return this.apiResponse.ok({ note });
  }
  public async insert(request: Request) {
    const { body: payload, user } = request;
    const note = await this.noteService.createNewNote(
      payload,
      user as HydratedDocument<IAccount>,
    );
    return this.apiResponse.created({ note });
  }

  public async update(request: Request) {
    const { body: payload, user } = request;
    const { noteId } = request.params;

    await this.noteService.updateNoteById(
      noteId,
      payload,
      user as HydratedDocument<IAccount>,
    );

    return this.apiResponse.updated(null);
  }
  public async destroy(request: Request) {
    const { user } = request;
    const { noteId } = request.params;
    await this.noteService.deleteNoteById(noteId, user as HydratedDocument<IAccount>);

    return this.apiResponse.deleted(null);
  }
}
