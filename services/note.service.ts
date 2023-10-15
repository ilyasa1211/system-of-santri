import { BadRequestError, NotFoundError } from "../enums/errors";
import { ResponseMessage } from "../enums/response";
import Note from "../models/note.model";
import NoteRepository from "../repositories/note.repository";
import { TAccount } from "../types/account";

export default class NoteService {
    private noteRepository;

    public constructor(noteModel: typeof Note) {
        this.noteRepository = new NoteRepository(noteModel);
    }
    public async getAllNotes() {
        const notes = await this.noteRepository.findAll();
        return notes;
    }
    public async getNoteById(noteId: string) {
        const note = await this.noteRepository.findById(noteId);
        return note;
    }
    public async createNewNote(payload: any, user: TAccount) {
        const { noteId, note, learningId } = payload;

        if (!learningId) {
            throw new BadRequestError(ResponseMessage.INVALID_LEARNING_ID);
        }
        if (!note) {
            throw new BadRequestError(ResponseMessage.NOTE_REQUIRED);
        }

        const isNoteExists = await this.noteRepository.findById(noteId);

        if (!isNoteExists) {
            throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
        }

        const createdNote = await Note.create(payload);
        return createdNote;
    }
    public async updateNoteById(noteId: string, payload: any, user: TAccount) {
        const updatedNote = await this.noteRepository.updateById(
            noteId,
            payload,
        );
        return updatedNote;
    }
    public async deleteNoteById(noteId: string, user: TAccount) {
        const deletedNote = await Note.findByIdAndDelete(noteId);
        return deletedNote;
    }
}
