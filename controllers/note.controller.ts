import { Request, Response } from "express";
import ApiResponse from "../utils/api-response";
import NoteService from "../services/note.service";
import Note from "../models/note.model";
import { TAccount } from "../types/account";

export default class NoteController {
    private readonly noteService;
    private readonly apiResponse;

    public constructor() {
        this.noteService = new NoteService(Note);
        this.apiResponse = ApiResponse;
    }
    public async index(request: Request, response: Response) {
        const notes = await this.noteService.getAllNotes();
        return new this.apiResponse(response).ok({ notes });
    }
    public async show(request: Request, response: Response) {
        const { noteId } = request.params;
        const note = await this.noteService.getNoteById(noteId);

        return new this.apiResponse(response).ok({ note });
    }
    public async insert(request: Request, response: Response) {
        const { body: payload, user } = request;
        const note = await this.noteService.createNewNote(
            payload,
            user as TAccount,
        );
        return new this.apiResponse(response).created({ note });
    }

    public async update(request: Request, response: Response) {
        const { body: payload, user } = request;
        const { noteId } = request.params;

        await this.noteService.updateNoteById(
            noteId,
            payload,
            user as TAccount,
        );

        return new this.apiResponse(response).updated(null, false);
    }
    public async destroy(request: Request, response: Response) {
        const { user } = request;
        const { noteId } = request.params;
        await this.noteService.deleteNoteById(noteId, user as TAccount);

        return new this.apiResponse(response).deleted(null, false);
    }
}
