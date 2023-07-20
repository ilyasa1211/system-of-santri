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
exports.verify = exports.signup = exports.signin = exports.resetPassword = exports.resendVerifyEmail = exports.forgotPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../traits/errors");
const models_1 = require("../models");
const utils_1 = require("../utils");
const role_1 = require("../traits/role");
const email_pattern_1 = __importDefault(require("../traits/email-pattern"));
const response_1 = require("../traits/response");
/**
 * Register an account
 */
function signup(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const date = new Date();
            const { name, email, password, accessCode: accessCodeInput } = request.body;
            if (!email) {
                throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_EMAIL);
            }
            if (!email_pattern_1.default.test(email)) {
                throw new errors_1.BadRequestError(response_1.ResponseMessage.INVALID_EMAIL);
            }
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
            const hash = (0, utils_1.generateToken)();
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
            const token = jsonwebtoken_1.default.sign({ id, email, name }, String(process.env.JWT_SECRET));
            yield (0, utils_1.sendVerifyEmail)(hash, account);
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
exports.signup = signup;
/**
 * Login to an account
 */
function signin(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = request.body;
            if (!email) {
                throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_EMAIL);
            }
            if (!email_pattern_1.default.test(email)) {
                throw new errors_1.BadRequestError(response_1.ResponseMessage.INVALID_EMAIL);
            }
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
            const valid = yield argon2_1.default.verify(account.password, password);
            if (!valid) {
                throw new errors_1.UnauthorizedError(response_1.ResponseMessage.WRONG_PASSWORD);
            }
            const token = jsonwebtoken_1.default.sign({ id, email, name }, String(process.env.JWT_SECRET));
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
exports.signin = signin;
/**
 *  Used to resend email verification token
 */
function resendVerifyEmail(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let authToken = undefined;
            let email = undefined;
            if (request.headers.authorization &&
                request.headers.authorization.split(" ")[0] === "Bearer") {
                authToken = request.headers.authorization.split(" ")[1];
            }
            if (!authToken) {
                throw new errors_1.BadRequestError("Please provide authorization header.");
            }
            jsonwebtoken_1.default.verify(authToken, String(process.env.JWT_SECRET), function (error, decoded) {
                if (error) {
                    throw new errors_1.BadRequestError(response_1.ResponseMessage.TOKEN_FAILED);
                }
                email = decoded.email;
            });
            const account = yield models_1.Account.findOne({ email }).select("email").exec();
            if (!account) {
                throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
            }
            const hash = (0, utils_1.generateToken)();
            account.hash = hash;
            yield account.save();
            yield (0, utils_1.sendVerifyEmail)(hash, account);
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Your confirmation email was successfully sent again. Check your inbox, then adhere to the directions to finish the verification process. Don't forget to look in your spam or junk folder if you don't see the email in your inbox.",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.resendVerifyEmail = resendVerifyEmail;
/**
 * Verify an account
 */
function verify(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { hash } = request.query;
            if (!hash) {
                throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_TOKEN);
            }
            const account = yield models_1.Account.findOne({ hash });
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
exports.verify = verify;
/**
 * When a user forgot their account password
 */
function forgotPassword(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = request.body;
            if (!email) {
                throw new errors_1.BadRequestError(response_1.ResponseMessage.EMPTY_EMAIL);
            }
            const account = yield models_1.Account.findOne({ email, deletedAt: null });
            if (!account) {
                throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
            }
            const token = (0, utils_1.generateToken)(3);
            const forgetToken = token;
            account.forgetToken = token;
            yield account.save();
            yield (0, utils_1.sendForgetPasswordEmail)(forgetToken, account);
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: response_1.ResponseMessage.CHECK_EMAIL,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.forgotPassword = forgotPassword;
/**
 * Reset account password
 */
function resetPassword(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
            account.password = yield argon2_1.default.hash(password, { type: argon2_1.default.argon2i });
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
exports.resetPassword = resetPassword;
