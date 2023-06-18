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
const trim_all_body_1 = __importDefault(require("../utils/trim-all-body"));
const role_1 = require("../traits/role");
const email_pattern_1 = __importDefault(require("../traits/email-pattern"));
const get_role_name_1 = __importDefault(require("../utils/get-role-name"));
const filterProperties_1 = __importDefault(require("../utils/filterProperties"));
/**
 * Register an account
 */
function signup(request, response, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const date = new Date();
            const { name, email, password, accessCode: accessCodeInput } = request.body;
            if (!email) {
                throw new errors_1.BadRequestError("Please enter a working email address. Email is a necessary field.");
            }
            if (!email_pattern_1.default.test(email)) {
                throw new errors_1.BadRequestError("Please enter a correct email address.");
            }
            if (!password) {
                throw new errors_1.BadRequestError("To ensure the security of your account, kindly provide a password.");
            }
            if (password.length < 8) {
                throw new errors_1.BadRequestError("Please pick a password that is at least 8 characters long for the security of your account.");
            }
            if (!accessCodeInput) {
                throw new errors_1.BadRequestError("Please enter the needed access code to continue.");
            }
            const accessCode = yield (0, utils_1.getAccessCode)(models_1.Configuration);
            if (accessCodeInput !== accessCode) {
                throw new errors_1.UnauthorizedError("Denied access. The access code you entered is inapplicable. Please check the code and try once more.");
            }
            if (request.file)
                request.body.photo = request.file.filename;
            const hash = (0, utils_1.generateToken)();
            (0, trim_all_body_1.default)(request);
            const defaultValue = {
                verify: false,
                verifyExpiration: date.setDate(date.getDate() + 1),
                role_id: role_1.ROLES.SANTRI,
                hash: hash,
                password: yield argon2_1.default.hash(password, {
                    type: argon2_1.default.argon2i,
                }),
            };
            Object.assign(request.body, defaultValue);
            const account = yield models_1.Account.create(request.body);
            const { id } = account;
            const token = jsonwebtoken_1.default.sign({ id, email, name }, String(process.env.JWT_SECRET));
            yield (0, utils_1.sendVerifyEmail)(hash, account);
            const filteredAccount = (0, filterProperties_1.default)(account, [
                "name",
                "email",
                "role",
            ], { role: (0, get_role_name_1.default)(Number(account.role)) });
            return response.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "Please check your email for any additional instructions",
                account: filteredAccount,
                token,
            });
        }
        catch (error) {
            if (((_a = error.message) === null || _a === void 0 ? void 0 : _a.indexOf("duplicate key error")) !== -1) {
                error.code = http_status_codes_1.StatusCodes.CONFLICT;
                error.message =
                    "We apologize, but it appears that the email address you provided is already registered. To complete the registration process, kindly enter a different email address.";
            }
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
                throw new errors_1.BadRequestError("Please enter a working email address. Email is a necessary field.");
            }
            if (!email_pattern_1.default.test(email)) {
                throw new errors_1.BadRequestError("Please enter a correct email address.");
            }
            if (!password) {
                throw new errors_1.BadRequestError("Please type in your password.");
            }
            const account = yield models_1.Account.findOne({
                email,
                deletedAt: null,
            });
            if (!account) {
                throw new errors_1.NotFoundError("We apologize, but the requested account was not found.");
            }
            if (!account.verify) {
                throw new errors_1.UnauthorizedError("Please be aware that your account has not yet been verified, which we regret. A critical step in ensuring the safety and reliability of our platform is account verification. Please check your registered email for a verification link or further instructions before continuing. Please double-check your spam or junk folder if you haven't received a verification email. ");
            }
            const valid = yield argon2_1.default.verify(account.password, password);
            if (!valid) {
                throw new errors_1.UnauthorizedError("Sorry, but the password you provided is unreliable. Please try again after double-checking your password.");
            }
            const { id, name } = account;
            const token = jsonwebtoken_1.default.sign({ id, email, name }, String(process.env.JWT_SECRET));
            const filteredAccount = (0, filterProperties_1.default)(account, [
                "name",
                "email",
                "role",
            ], { role: (0, get_role_name_1.default)(Number(account.role)) });
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Welcome! Your account has been successfully logged into. Enjoy yourself and feel free to explore the features and services that are offered. ",
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
                    throw new errors_1.BadRequestError("Verification of token failed. Check the details provided, then try once more.");
                }
                email = decoded.email;
            });
            const account = yield models_1.Account.findOne({ email });
            if (!account) {
                throw new errors_1.NotFoundError("We apologize, but the requested account was not found.");
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
                throw new errors_1.BadRequestError("The supplied token is not valid. Make sure token field is entered correctly.");
            }
            const account = yield models_1.Account.findOne({ hash });
            if (!account) {
                throw new errors_1.NotFoundError("We apologize, but the requested account was not found.");
            }
            account.hash = null;
            account.verify = true;
            yield account.save();
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Congratulations! Your account has been verified successfully. Now that you have accessed your account, you can use our services as you please.",
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
                throw new errors_1.BadRequestError("Please enter a working email address. Email is a necessary field.");
            }
            const account = yield models_1.Account.findOne({ email, deletedAt: null });
            if (!account) {
                throw new errors_1.NotFoundError("We apologize, but the requested account was not found.");
            }
            const token = (0, utils_1.generateToken)(3);
            const forgetToken = token;
            account.forgetToken = token;
            yield account.save();
            yield (0, utils_1.sendForgetPasswordEmail)(forgetToken, account);
            return response.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Please check your email for any additional instructions",
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
                throw new errors_1.BadRequestError("The supplied token is not valid. Make sure token field is entered correctly.");
            }
            if (!password) {
                throw new errors_1.BadRequestError("Please enter your new password in order to continue.");
            }
            if (password !== confirmPassword) {
                throw new errors_1.BadRequestError("Your provided confirmation password and password for your password do not match. For successful verification, please make sure the password in both fields matches.");
            }
            const account = yield models_1.Account.findOne({ forgetToken });
            if (!account) {
                throw new errors_1.NotFoundError("We apologize, but the requested account was not found.");
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
