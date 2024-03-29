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
const node_path_1 = __importDefault(require("node:path"));
const nodemailer_1 = __importDefault(require("../configs/nodemailer"));
const pug_1 = __importDefault(require("pug"));
const get_account_username_1 = __importDefault(require("./get-account-username"));
const appUrl = process.env.APP_URL;
/**
 * Sending a forgot password email
 */
function sendForgetPasswordEmail(token, account) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email } = account;
        nodemailer_1.default.sendMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "Reset Password",
            html: pug_1.default.renderFile(node_path_1.default.join(__dirname, "..", "views", "forget-password-email.pug"), { token, appUrl, username: (0, get_account_username_1.default)(name) }),
        });
    });
}
exports.default = sendForgetPasswordEmail;
