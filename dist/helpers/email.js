import { BadRequestError } from "../enums/errors";
import { getAccountUsername } from "../utils";
import { ResponseMessage } from "../enums/response";
import path from "path";
import pug from "pug";
class Email {
    constructor(account, emailField = "email") {
        var _a, _b;
        this._accountName = (_a = account.name) !== null && _a !== void 0 ? _a : "New Member";
        this._accountEmail = (_b = account[emailField]) !== null && _b !== void 0 ? _b : account.email;
    }
    static validate(email) {
        if (!email) {
            throw new BadRequestError(ResponseMessage.EMPTY_EMAIL);
        }
        if (!this.emailPattern.test(email)) {
            throw new BadRequestError(ResponseMessage.INVALID_EMAIL);
        }
    }
    validate() {
        return Email.validate(this._accountEmail);
    }
    send(send) {
        const pugFilePath = path.join(__dirname, "..", "views", send.pugFilename);
        const pugData = {
            token: send.token,
            username: getAccountUsername(this._accountName),
        };
        const html = pug.renderFile(pugFilePath, pugData);
        return (transporter) => transporter.sendMail({
            from: process.env.MAIL_USERNAME,
            to: this._accountEmail,
            subject: send.subject,
            html,
        });
    }
}
Email.emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default Email;
export class SendEmail {
    constructor(token) {
        this.token = token;
    }
}
export class VerifyEmail extends SendEmail {
    constructor(token) {
        super(token);
        this.pugFilename = "verify-email.pug";
        this.subject = "Account Verification - Action Required";
    }
}
export class ForgetEmail extends SendEmail {
    constructor(token) {
        super(token);
        this.pugFilename = "forget-password-email.pug";
        this.subject = "Reset Password";
    }
}
