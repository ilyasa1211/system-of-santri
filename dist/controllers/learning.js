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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.show = exports.insert = exports.index = exports.destroy = void 0;
const models_1 = require("../models");
const http_status_codes_1 = require("http-status-codes");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const errors_1 = require("../traits/errors");
const response_1 = require("../traits/response");
/**
 * Get all learnings, everyone has rights
 */
function index(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const learnings = yield models_1.Learning.find();
            return response.status(http_status_codes_1.StatusCodes.OK).json({ learnings });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.index = index;
/**
 * Show one learning, everyone has rights
 */
function show(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
exports.show = show;
/**
 * Create a new learning, manager has rights
 */
function insert(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
exports.insert = insert;
/**
 * Update an existing learning, manager has rights
 */
function update(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
exports.update = update;
/**
 * Delete a learning, manager has rights
 */
function destroy(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const learning = yield models_1.Learning.findById(id);
            if (!learning) {
                throw new errors_1.NotFoundError(response_1.ResponseMessage.LEARNING_NOT_FOUND);
            }
            const { thumbnail } = learning;
            yield learning.deleteOne();
            if (!thumbnail.endsWith(String(process.env.DEFAULT_THUMBNAIL_NAME))) {
                node_fs_1.default.unlink(node_path_1.default.join(__dirname, "..", "public", thumbnail), (error) => {
                    if (error)
                        throw error;
                });
            }
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: response_1.ResponseMessage.LEARNING_DELETED,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.destroy = destroy;
