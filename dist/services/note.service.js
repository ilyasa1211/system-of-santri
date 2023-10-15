import { BadRequestError, NotFoundError } from "../enums/errors";
import { ResponseMessage } from "../enums/response";
import Note from "../models/note.model";
import NoteRepository from "../repositories/note.repository";
export default class NoteService {
    constructor(noteModel) {
        this.noteRepository = new NoteRepository(noteModel);
    }
    async getAllNotes() {
        const notes = await this.noteRepository.findAll();
        return notes;
    }
    async getNoteById(noteId) {
        const note = await this.noteRepository.findById(noteId);
        return note;
    }
    async createNewNote(payload, user) {
        const { noteId, note } = payload;
        if (!id) {
            throw new BadRequestError(ResponseMessage.INVALID_LEARNING_ID);
        }
        if (!note) {
            throw new BadRequestError(ResponseMessage.NOTE_REQUIRED);
        }
        const noteExists = await this.noteRepository.findById(noteId);
        if (!noteExists) {
            throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
        }
        const createdNote = await Note.create(payload);
        return createdNote;
    }
    async updateNoteById(noteId, payload, user) {
        const updatedNote = await this.noteRepository.updateById(noteId, payload);
        return updatedNote;
    }
    async deleteNoteById(noteId, user) {
        const deletedNote = await Note.findByIdAndDelete(noteId);
        return deletedNote;
    }
}
