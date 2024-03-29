import { Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import NoteService from "../services/note.service";
import Note from "../models/note.model";
import { IAccount } from "../models/account.model";
import { HydratedDocument } from "mongoose";

// TODO: this controller need help
export class NoteController {
  public constructor(
    private readonly service: NoteService,
    private readonly apiResponse: ApiResponse,
  ) {}

  public async index(request: Request) {
    const notes = await this.service.findAll();

    return this.apiResponse.ok({ notes });
  }

  public async show(request: Request) {
    const { noteId } = request.params;
    const note = await this.service.findId(noteId);

    return this.apiResponse.ok({ note });
  }

  public async create(request: Request) {
    const { body: payload, user } = request;
    const note = await this.service.create(
      payload,
      user as HydratedDocument<IAccount>,
    );
    return this.apiResponse.created({ note });
  }

  public async update(request: Request) {
    const { body: payload, user } = request;
    const { noteId } = request.params;

    await this.service.updateId(
      noteId,
      payload,
      user as HydratedDocument<IAccount>,
    );

    return this.apiResponse.updated(null);
  }

  public async destroy(request: Request) {
    const { user } = request;
    const { noteId } = request.params;
    await this.service.deleteId(noteId, user as HydratedDocument<IAccount>);

    return this.apiResponse.deleted(null);
  }
}
