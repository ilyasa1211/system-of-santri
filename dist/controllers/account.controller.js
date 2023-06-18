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
exports.workShow = exports.workIndex = exports.update = exports.trash = exports.show = exports.resume = exports.restore = exports.profile = exports.insert = exports.index = exports.eliminate = exports.destroy = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const argon2_1 = __importDefault(require("argon2"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const trim_all_body_1 = __importDefault(require("../utils/trim-all-body"));
const projection = {
    password: 0,
    verify: 0,
    hash: 0,
    forgetToken: 0,
    __v: 0,
};
/**
 *  Get All Accounts, everyone has rights
 */
function index(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const withTrashed = request.query.trashed;
            const option = {
                deletedAt: null,
            };
            if (withTrashed)
                option.deletedAt = { $ne: null };
            const accounts = yield models_1.Account.find(option, projection);
            return response.status(http_status_codes_1.StatusCodes.OK).json({ accounts });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.index = index;
/**
 * Create an account to the database, only admin has rights
 */
function insert(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (request.file)
                request.body.avatar = request.file.filename;
            (0, trim_all_body_1.default)(request);
            request.body.verify = true;
            request.body.password = yield argon2_1.default.hash(request.body.password, {
                type: argon2_1.default.argon2i,
            });
            const account = yield models_1.Account.create(request.body);
            const { id } = account;
            const token = jsonwebtoken_1.default.sign({ id, name: request.body.name }, String(process.env.JWT_SECRET));
            return response.status(http_status_codes_1.StatusCodes.OK).json({ token });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.insert = insert;
/**
 * Show one account, everyone has rights
 */
function show(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const account = yield models_1.Account.findOne({ _id: id, deletedAt: null }, projection);
            return response.status(http_status_codes_1.StatusCodes.OK).json({ account });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.show = show;
/**
 * Update the existing account, the user of the account and admin has rights
 */
function update(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            (0, utils_1.authorize)(request.user, id);
            request.body.updatedAt = Date.now();
            yield models_1.Account.findOneAndUpdate({ _id: id, deletedAt: null }, request.body);
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Congratulations on finishing up your account update! Your suggestions have been carried out.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.update = update;
/**
 * Delete one account not permanently, the user of the account and admin has rights
 */
function destroy(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            (0, utils_1.authorize)(request.user, id);
            yield models_1.Account.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: Date.now() });
            return response.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
                message: "That your account has been deleted, we apologize. Please let us know if you need any help or if you have any questions.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.destroy = destroy;
/**
 * Show all deleted account, admin has rights
 */
function trash(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accounts = yield models_1.Account.find({ deletedAt: { $ne: null } });
            return response.status(http_status_codes_1.StatusCodes.OK).json({ accounts });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.trash = trash;
/**
 * Restore one of the deleted account, admin has rights
 */
function restore(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            yield models_1.Account.findByIdAndUpdate(id, { deletedAt: null });
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Good news! Your account has been restored successfully. Hello again! Please feel free to ask any questions or for additional help.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.restore = restore;
/**
 * Delete one account PERMANENTLY be careful, admin has rights
 */
function eliminate(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const account = yield models_1.Account.findById(id);
            if (!account) {
                throw new errors_1.NotFoundError("We apologize, but the requested account was not found.");
            }
            const { avatar } = account;
            yield account.deleteOne();
            if (avatar !== "default-avatar.jpg") {
                node_fs_1.default.unlink(node_path_1.default.join(__dirname, "..", "public", "images", "account", avatar), (error) => {
                    if (error)
                        throw error;
                });
            }
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "All associated data was successfully deleted and the account was successfully cleared.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.eliminate = eliminate;
/**
 * Get information about my account, everyone has rights
 */
function profile(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.user;
            const account = yield models_1.Account.findById(id, projection);
            if (!account) {
                throw new errors_1.NotFoundError("We apologize, but the requested account was not found.");
            }
            return response.status(http_status_codes_1.StatusCodes.OK).json({ account });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.profile = profile;
/**
 * Get all works about an account, everyone has rights
 */
function workIndex(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const works = yield models_1.Work.find({ account_id: id });
            return response.json({ works });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.workIndex = workIndex;
/**
 * Get a work about an account, everyone has rights
 */
function workShow(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { workId, id } = request.params;
            const works = yield models_1.Work.find({
                _id: workId,
                account_id: id,
            });
            if (!works) {
                throw new errors_1.NotFoundError("We're sorry to let you know that we were unable to locate the requested work. Please double-check your entry of accurate information before attempting again. Please don't hesitate to contact our support staff if you need more help.");
            }
            return response.status(http_status_codes_1.StatusCodes.OK).json({ works });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.workShow = workShow;
/**
 * Get a resume of an account, everyone has rights
 */
function resume(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const resume = yield models_1.Resume.findOne({ account_id: id });
            if (!resume) {
                throw new errors_1.NotFoundError("We regret the inconvenience, but we were unable to locate the requested resume. Please verify the information provided.");
            }
            return response.status(http_status_codes_1.StatusCodes.OK).json({ resume });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.resume = resume;
