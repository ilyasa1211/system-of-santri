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
const models_1 = require("../models");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../enums/errors");
const response_1 = require("../enums/response");
const delete_photo_1 = require("../utils/delete-photo");
class LearningController {
    /**
     * Get all learnings, everyone has rights
     */
    index(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const learnings = yield models_1.Learning.find();
                return response.status(http_status_codes_1.StatusCodes.OK).json({ learnings });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Show one learning, everyone has rights
     */
    show(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { id } = request.params;
                const learning = yield models_1.Learning.findById(id);
                if (!learning) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.LEARNING_NOT_FOUND);
                }
                return response.status(http_status_codes_1.StatusCodes.OK).json({ learning });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Create a new learning, manager has rights
     */
    insert(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { body, file } = request;
                !body.thumbnail && delete body.thumbnail;
                if (file) {
                    const { path } = file;
                    body.thumbnail = path.slice(path.indexOf("images"));
                }
                yield models_1.Learning.create(body);
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.LEARNING_CREATED,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Update an existing learning, manager has rights
     */
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { body, file, params } = request;
                const { id } = params;
                if (file) {
                    const { path } = file;
                    body.thumbnail = path.slice(path.indexOf("images"));
                }
                const learning = yield models_1.Learning.findById(id);
                if (!learning) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.LEARNING_NOT_FOUND);
                }
                Object.assign(learning, body);
                yield learning.save();
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.LEARNING_UPDATED,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Delete a learning, manager has rights
     */
    destroy(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { id } = request.params;
                const learning = yield models_1.Learning.findById(id);
                if (!learning) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.LEARNING_NOT_FOUND);
                }
                yield learning.deleteOne();
                (0, delete_photo_1.deletePhoto)(learning.thumbnail);
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.LEARNING_DELETED,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = LearningController;
