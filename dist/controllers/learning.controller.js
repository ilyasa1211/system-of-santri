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
const not_found_1 = __importDefault(require("../errors/not-found"));
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
            const learning = yield models_1.Learning.findById(request.params.id);
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
            if (request.file) {
                request.body.thumbnail = request.file.filename;
            }
            yield models_1.Learning.create(request.body);
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Congratulations on developing a lesson successfully! Your commitment to education and knowledge sharing is admirable. ",
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
            if (request.file) {
                request.body.thumbnail = request.file.filename;
            }
            const learning = yield models_1.Learning.findById(request.params.id);
            if (!learning) {
                throw new not_found_1.default("We regret any inconvenience this may have caused, but it doesn't seem like the requested lesson was available. ");
            }
            Object.assign(learning, request.body);
            yield learning.save();
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Congratulations on finishing up your lesson update! Your commitment to enhancing and perfecting the instructional materials is admirable.",
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
            const learning = yield models_1.Learning.findById(request.params.id);
            if (!learning) {
                throw new not_found_1.default("We regret any inconvenience this may have caused, but it doesn't seem like the requested lesson was available.");
            }
            const { thumbnail } = learning;
            if (thumbnail && thumbnail !== "default-thumbnail.jpg") {
                const saveLearningThumbnail = process.env.SAVE_LEARNING_THUMBNAIL;
                node_fs_1.default.unlink(node_path_1.default.join(__dirname, "..", "public", "images", saveLearningThumbnail, thumbnail), (error) => {
                    if (error)
                        throw error;
                });
            }
            yield learning.deleteOne();
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "The deletion of your lesson was successful. The learning platform has removed it, and all associated data has been permanently deleted.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.destroy = destroy;
