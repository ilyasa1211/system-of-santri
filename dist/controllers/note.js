"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {  step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) {  step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const note_1 = require("../models/note");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../enums/errors");
const response_1 = require("../enums/response");
class NoteController {
    /**
     * Get all manager's notes
     */
    index(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const notes = yield note_1.Note.find();
                return response.status(http_status_codes_1.StatusCodes.OK).json({ notes });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Show one manager's note
     */
    show(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const note = yield note_1.Note.findById(request.params.id);
                return response.status(http_status_codes_1.StatusCodes.OK).json({ note });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Create a new notes, manager has rights
     */
    insert(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
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
    /**
     * Update the existing note, manager has rights
     */
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
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
    /**
     * Delete a note permanently, manager has rights
     */
    destroy(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
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
}
exports.default = NoteController;
