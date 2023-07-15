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
const nodemailer_1 = __importDefault(require("../configs/nodemailer"));
const pug_1 = __importDefault(require("pug"));
const node_path_1 = __importDefault(require("node:path"));
const get_account_username_1 = __importDefault(require("./get-account-username"));
const appUrl = process.env.APP_URL;
/**
 * Send verify email
 */
function sendVerifyEmail(hash, account) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email } = account;
        nodemailer_1.default.sendMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "Account Verification - Action Required",
            html: pug_1.default.renderFile(node_path_1.default.join(__dirname, "..", "views", "verify-email.pug"), {
                hash,
                appUrl,
                username: (0, get_account_username_1.default)(name),
            }),
        });
    });
}
exports.default = sendVerifyEmail;
