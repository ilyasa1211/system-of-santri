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
const models_1 = require("../models");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../utils");
const errors_1 = require("../traits/errors");
/**
 * Get all works from all account, everyone has rights
 */
function index(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const works = yield models_1.Work.find({}, {}, { sort: { createdAt: "desc" } });
            return response.status(http_status_codes_1.StatusCodes.OK).json({ works });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.index = index;
/**
 * Show one work from id, everyone has rights
 */
function show(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const work = yield models_1.Work.findOne({ _id: request.params.id });
            return response.status(http_status_codes_1.StatusCodes.OK).json({ work });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.show = show;
/**
 * Create a new work, everyone has rights
 */
function insert(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = request.user;
            request.body.account_id = user.id;
            const works = yield models_1.Work.create(request.body);
            const account = yield models_1.Account.findById(user.id);
            account.work.push(works.id);
            yield account.save();
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Congratulations on completing your work successfully! This is a noteworthy accomplishment that highlights your talent and commitment.",
                works,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.insert = insert;
/**
 * Update the exisiting work, the owner of the work has rights
 */
function update(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const { title, link } = request.body;
            const user = request.user;
            const work = yield models_1.Work.findById(id);
            if (!work) {
                throw new errors_1.NotFoundError("We're sorry to let you know that we were unable to locate the requested work. Please double-check your entry of accurate information before attempting again. Please don't hesitate to contact our support staff if you need more help.");
            }
            (0, utils_1.authorize)(user, work.account_id.toString());
            if (title)
                work.title = title;
            if (link)
                work.link = link;
            work.updatedAt = Date.now().toString();
            yield work.save();
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Congratulations on finishing your work update! Your dedication to honing and enhancing your work is admirable. ",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.update = update;
/**
 * Delete a work permanently, the owner of the work has rights
 */
function destroy(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const user = request.user;
            const work = yield models_1.Work.findById(id);
            if (!work) {
                throw new errors_1.NotFoundError("We're sorry to let you know that we were unable to locate the requested work. Please double-check your entry of accurate information before attempting again. Please don't hesitate to contact our support staff if you need more help.");
            }
            (0, utils_1.authorize)(user, work.account_id.toString());
            yield work.deleteOne();
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Your writing has been effectively erased. All related information has been permanently deleted, and it has been taken out of our records.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.destroy = destroy;
