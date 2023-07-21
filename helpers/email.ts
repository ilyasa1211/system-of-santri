import { BadRequestError } from "../traits/errors";
import pug from "pug";

import { ResponseMessage } from "../traits/response";
import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { IAccount } from "../models";
import path from "path";
import { getAccountUsername } from "../utils";

export default class Email {
	private _emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	private _accountName: string;
	private _accountEmail: string;

	public constructor({ name, email }: IAccount) {
		this._accountName = name;
		this._accountEmail = email;
	}

	public static validate(email: string): never | void {
		if (!email) {
			throw new BadRequestError(ResponseMessage.EMPTY_EMAIL);
		}
		if (!this.prototype._emailPattern.test(email)) {
			throw new BadRequestError(ResponseMessage.INVALID_EMAIL);
		}
	}

	public validate(): never | void {
		return Email.validate(this._accountEmail);
	}
	public send(send: SendEmail) {
		const pugFilePath = path.join(__dirname, "..", "views", send.pugFilename);
		const pugData = {
			token: send.token,
			username: getAccountUsername(this._accountName),
		};
		const html: string = pug.renderFile(pugFilePath, pugData);

		return (transporter: Transporter<SMTPTransport.SentMessageInfo>) =>
			transporter.sendMail({
				from: process.env.MAIL_USERNAME,
				to: this._accountEmail,
				subject: send.subject,
				html,
			});
	}
}

export interface ISendEmail {
	readonly subject: string;
	readonly pugFilename: string;
}

export class SendEmail implements ISendEmail {
	public constructor(public readonly token: string) {}
	public readonly subject: string = "";
	public readonly pugFilename: string = "";
}

export class VerifyEmail extends SendEmail {
	public constructor(token: string) {
		super(token);
	}

	public readonly pugFilename: string = "verify-email.pug";
	public readonly subject: string = "Account Verification - Action Required";
}

export class ForgetEmail extends SendEmail {
	public constructor(token: string) {
		super(token);
	}

	public readonly pugFilename: string = "forget-password-email.pug";
	public readonly subject: string = "Reset Password";
}
