"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.show = exports.insert = exports.index = exports.destroy = void 0;
const note_1 = require("../models/note");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../traits/errors");
const response_1 = require("../traits/response");
/**
 * Get all manager's notes
 */
function index(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notes = yield note_1.Note.find();
            return response.status(http_status_codes_1.StatusCodes.OK).json({ notes });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.index = index;
/**
 * Show one manager's note
 */
function show(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const note = yield note_1.Note.findById(request.params.id);
            return response.status(http_status_codes_1.StatusCodes.OK).json({ note });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.show = show;
/**
 * Create a new notes, manager has rights
 */
function insert(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, note } = request.body;
            if (!id) {
                throw new errors_1.BadRequestError(response_1.ResponseMessage.INVALID_LEARNING_ID);
            }
            if (!note) {
                throw new errors_1.BadRequestError(response_1.ResponseMessage.NOTE_REQUIRED);
            }
            const learningExists = yield note_1.Note.exists({ _id: id });
            if (!learningExists) {
                throw new errors_1.NotFoundError(response_1.ResponseMessage.LEARNING_NOT_FOUND);
            }
            const notes = yield note_1.Note.create(request.body);
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: response_1.ResponseMessage.NOTE_CREATED,
                notes,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.insert = insert;
/**
 * Update the existing note, manager has rights
 */
function update(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notes = yield note_1.Note.findByIdAndUpdate(request.params.id, request.body);
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: response_1.ResponseMessage.NOTE_UPDATED,
                notes,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.update = update;
/**
 * Delete a note permanently, manager has rights
 */
function destroy(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notes = yield note_1.Note.findByIdAndDelete(request.params.id);
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: response_1.ResponseMessage.NOTE_DELETED,
                notes,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.destroy = destroy;
