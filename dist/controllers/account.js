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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../enums/errors");
const models_1 = require("../models");
const utils_1 = require("../utils");
const response_1 = require("../enums/response");
const delete_photo_1 = require("../utils/delete-photo");
const password_1 = __importDefault(require("../helpers/password"));
const token_1 = __importDefault(require("../helpers/token"));
const account_1 = __importDefault(require("../services/account"));
class AccountController {
    constructor() {
        this.accountService = new account_1.default();
    }
    /**
     *  Get All Accounts, everyone has rights
     */
    index(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const accounts = yield this.accountService.getAllAccount(request);
                return response.status(http_status_codes_1.StatusCodes.OK).json({ accounts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Create an account to the database, only admin has rights
     */
    insert(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const account = yield this.accountService.insertAccount(request);
                const token = token_1.default.generateJwtToken(account);
                return response.status(http_status_codes_1.StatusCodes.OK).json({ token });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Show one account, everyone has rights
     */
    show(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const account = this.accountService.getAccountById(request.params.id)(request);
                return response.status(http_status_codes_1.StatusCodes.OK).json({ account });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Update the existing account, the user of the account and admin has rights
     */
    update(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { body, file, user } = request;
                const { id } = request.params;
                (0, utils_1.authorize)(user, id);
                let isAvatarUpdate = false;
                if (file) {
                    body.avatar = file.filename;
                    isAvatarUpdate = true;
                }
                if (body.password) {
                    body.password = yield password_1.default.hash(body.password);
                }
                models_1.Account.findOneAndUpdate({ _id: id, deletedAt: null }, request.body, {
                    returnDocument: "before",
                }, function (error, oldAccount) {
                    if (error)
                        throw error;
                    if (oldAccount && isAvatarUpdate) {
                        (0, delete_photo_1.deletePhoto)(oldAccount.avatar);
                    }
                });
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.ACCOUNT_UPDATED,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Delete one account not permanently, the user of the account and admin has rights
     */
    destroy(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { id } = request.params;
                (0, utils_1.authorize)(request.user, id);
                yield models_1.Account.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: Date.now() }).exec();
                return response.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
                    message: response_1.ResponseMessage.ACCOUNT_DELETED,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Show all deleted account, admin has rights
     */
    trash(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const accounts = yield models_1.Account.find({ deletedAt: { $ne: null } }).exec();
                return response.status(http_status_codes_1.StatusCodes.OK).json({ accounts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Restore one of the deleted account, admin has rights
     */
    restore(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { id } = request.params;
                yield models_1.Account.findByIdAndUpdate(id, { deletedAt: null }).exec();
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.ACCOUNT_RESTORED,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Delete one account PERMANENTLY be careful, admin has rights
     */
    eliminate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { id } = request.params;
                models_1.Account.findByIdAndDelete({ _id: id, deletedAt: { $ne: null } }, null, (error, account) => {
                    if (error)
                        throw error;
                    if (!account) {
                        throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
                    }
                    (0, delete_photo_1.deletePhoto)(account.avatar);
                });
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.ACCOUNT_DELETED_PERMANENT,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Get information about my account, everyone has rights
     */
    profile(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const account = yield this.accountService.getAccountById(request.user.id)(request);
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
    /**
     * Get all works about an account, everyone has rights
     */
    workIndex(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { id } = request.params;
                const works = yield models_1.Work.find({ accountId: id }).exec();
                return response.json({ works });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Get a work about an account, everyone has rights
     */
    workShow(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { workId, id } = request.params;
                const works = yield models_1.Work.find({
                    _id: workId,
                    accountId: id,
                }).exec();
                if (!works) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.WORK_NOT_FOUND);
                }
                return response.status(http_status_codes_1.StatusCodes.OK).json({ works });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Get a resume of an account, everyone has rights
     */
    resume(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { id } = request.params;
                const resume = yield models_1.Resume.findOne({ accountId: id }).exec();
                if (!resume) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.RESUME_NOT_FOUND);
                }
                return response.status(http_status_codes_1.StatusCodes.OK).json({ resume });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AccountController;
