"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const argon2_1 = __importDefault(require("argon2"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../enums/errors");
const models_1 = require("../models");
const utils_1 = require("../utils");
const role_1 = require("../enums/role");
const response_1 = require("../enums/response");
const email_1 = __importStar(require("../helpers/email"));
const token_1 = __importDefault(require("../helpers/token"));
const password_1 = __importDefault(require("../helpers/password"));
class AuthController {
    /**
     * Register an account
     */
    signup(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const date = new Date();
                const { name, email, password, accessCode: accessCodeInput, } = request.body;
                email_1.default.validate(email);
                if (!password) {
                    throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_PASSWORD);
                }
                if (password.length < 8) {
                    throw new errors_1.BadRequestError(response_1.ResponseMessage.WEAK_PASSWORD);
                }
                if (!accessCodeInput) {
                    throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_ACCESS_CODE);
                }
                const accessCode = yield (0, utils_1.getAccessCode)(models_1.Configuration);
                if (accessCodeInput !== accessCode) {
                    throw new errors_1.UnauthorizedError(response_1.ResponseMessage.WRONG_ACCESS_CODE);
                }
                if (request.file)
                    request.body.photo = request.file.filename;
                const hash = token_1.default.generateRandomToken();
                const defaultValue = {
                    verify: false,
                    verifyExpiration: date.setDate(date.getDate() + 1),
                    roleId: role_1.ROLES.SANTRI,
                    hash,
                    password: yield argon2_1.default.hash(password, {
                        type: argon2_1.default.argon2i,
                    }),
                };
                Object.assign(request.body, defaultValue);
                const account = (yield models_1.Account.create(request.body));
                const { id, roleId } = account;
                const filteredAccount = {
                    id,
                    name,
                    role: {
                        id: roleId,
                        name: (0, utils_1.getRoleName)(roleId),
                    },
                };
                const token = token_1.default.generateJwtToken(account);
                new email_1.default(account).send(new email_1.VerifyEmail(hash));
                return response.status(http_status_codes_1.StatusCodes.CREATED).json({
                    message: response_1.ResponseMessage.CHECK_EMAIL,
                    account: filteredAccount,
                    token,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Login to an account
     */
    signin(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { email, password } = request.body;
                email_1.default.validate(email);
                if (!password) {
                    throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_PASSWORD);
                }
                const account = (yield models_1.Account.findOne({
                    email,
                    deletedAt: null,
                })
                    .select("name roleId password email verify")
                    .exec());
                const { id, name, roleId } = account;
                const filteredAccount = {
                    id,
                    name,
                    role: {
                        id: roleId,
                        name: (0, utils_1.getRoleName)(roleId),
                    },
                };
                if (!account) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
                }
                if (!account.verify) {
                    throw new errors_1.UnauthorizedError(response_1.ResponseMessage.UNVERIFIED_ACCOUNT);
                }
                const valid = yield password_1.default.verify(account.password, password);
                if (!valid) {
                    throw new errors_1.UnauthorizedError(response_1.ResponseMessage.WRONG_PASSWORD);
                }
                const token = token_1.default.generateJwtToken(account);
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.LOGIN_SUCCEED,
                    account: filteredAccount,
                    token,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     *  Used to resend email verification token
     */
    resendVerifyEmail(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const jwtToken = token_1.default.getJwtToken(request);
                const { email } = token_1.default.getJwtPayload(jwtToken);
                const account = yield models_1.Account.findOne({ email }).select("email").exec();
                if (!account) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
                }
                const hash = token_1.default.generateRandomToken();
                account.hash = hash;
                yield account.save();
                new email_1.default(account).send(new email_1.VerifyEmail(hash));
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: ResponseMessage.CHECK_EMAIL_AGAIN
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Verify an account
     */
    verify(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { hash } = request.query;
                if (!hash) {
                    throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_TOKEN);
                }
                const account = yield models_1.Account.findOne({ hash }).exec();
                if (!account) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
                }
                account.hash = null;
                account.verify = true;
                yield account.save();
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.ACCOUNT_VERIFIED,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * When a user forgot their account password
     */
    forgotPassword(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { email } = request.body;
                if (!email) {
                    throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_EMAIL);
                }
                const account = yield models_1.Account.findOne({ email, deletedAt: null });
                if (!account) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
                }
                const token = token_1.default.generateRandomToken(3);
                const forgetToken = token;
                account.forgetToken = token;
                yield account.save();
                new email_1.default(account).send(new email_1.ForgetEmail(forgetToken));
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: response_1.ResponseMessage.CHECK_EMAIL,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Reset account password
     */
    resetPassword(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            
                const { token: forgetToken } = request.query;
                const { password, confirmPassword } = request.body;
                if (!forgetToken) {
                    throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_TOKEN);
                }
                if (!password) {
                    throw new errors_1.BadRequestError("Please enter your new password in order to continue.");
                }
                if (password !== confirmPassword) {
                    throw new errors_1.BadRequestError("Your provided confirmation password and password for your password do not match. For successful verification, please make sure the password in both fields matches.");
                }
                const account = yield models_1.Account.findOne({ forgetToken });
                if (!account) {
                    throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
                }
                account.password = yield password_1.default.hash(password);
                account.forgetToken = null;
                yield account.save();
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "Your new password was changed successfully.",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthController;
