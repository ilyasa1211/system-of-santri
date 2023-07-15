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
exports.resume = exports.workShow = exports.workIndex = exports.profile = exports.eliminate = exports.restore = exports.trash = exports.destroy = exports.update = exports.show = exports.insert = exports.index = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../traits/errors");
const argon2_1 = __importDefault(require("argon2"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const response_1 = require("../traits/response");
const projection = [
    "name",
    "email",
    "phoneNumber",
    "division",
    "status",
    "avatar",
    "santriPeriod",
    "generation",
    "generationYear",
    "role",
    "work",
    "absenses",
];
/**
 *  Get All Accounts, everyone has rights
 */
function index(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accounts = yield models_1.Account.find({ deletedAt: null })
                .select(projection);
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
            const { body, file } = request;
            const { name, email } = body;
            if (file)
                body.avatar = file.filename;
            body.verify = true;
            body.password = yield argon2_1.default.hash(body.password, {
                type: argon2_1.default.argon2i,
            });
            const account = yield models_1.Account.create(body);
            const { id } = account;
            const token = jsonwebtoken_1.default.sign({ id, email, name }, String(process.env.JWT_SECRET));
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
            const account = yield models_1.Account.findOne({ _id: id.replace(/[\W_]/g, ""), deletedAt: null }).select(projection);
            return response.status(http_status_codes_1.StatusCodes.OK).json({ account });
        }
        catch (error) {
            if (error.message.startsWith("Cast to ObjectId failed")) {
                error.message =
                    "We apologize for the inconvenience, but the provided Account ID appears to be invalid. Please double-check the ID and ensure its accuracy.";
                error.code = http_status_codes_1.StatusCodes.BAD_REQUEST;
            }
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
            const { body, file } = request;
            const { id } = request.params;
            (0, utils_1.authorize)(request.user, id);
            let isAvatarUpdate = false;
            if (file) {
                body.avatar = file.filename;
                isAvatarUpdate = true;
            }
            ;
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
                message: response_1.ResponseMessage.ACCOUNT_DELETED,
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
            return response.status(http_status_codes_1.StatusCodes.OK).json({ message: response_1.ResponseMessage.ACCOUNT_RESTORED });
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
            models_1.Account.findByIdAndDelete(id, null, (error, account) => __awaiter(this, void 0, void 0, function* () {
                if (error)
                    throw error;
                debugger;
                if (account == null)
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
                // account.deleteAvatar();
                debugger;
            }));
            return response.status(http_status_codes_1.StatusCodes.OK).json({ message: response_1.ResponseMessage.ACCOUNT_DELETED_PERMANENT });
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
            const account = yield models_1.Account.findById(id)
                .select(projection)
                .populate({
                path: "role",
                foreignField: "id",
                select: "-_id id name",
            })
                .exec();
            if (!account) {
                throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
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
            const works = yield models_1.Work.find({ account_id: id }).exec();
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
            }).exec();
            if (!works) {
                throw new errors_1.NotFoundError("We're sorry to let you know that we were unable to locate the requested work. Please double-check your entry of accurate information before attempting again.");
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
            const resume = yield models_1.Resume.findOne({ account_id: id }).exec();
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
