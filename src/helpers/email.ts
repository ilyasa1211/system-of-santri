import { ResponseMessage } from "../enums/response";
import { Transporter } from "nodemailer";
import path from "path";
import pug from "pug";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { HydratedDocument } from "mongoose";
import { IAccount } from "../models/account.model";
import { BadRequestError } from "../errors/errors";

export default class Email {
  public static readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private _accountName: string;
  private _accountEmail: string;

  public constructor(account: HydratedDocument<IAccount>) {
    this._accountName = account.name;
    this._accountEmail = account.email;
  }

  public static validate(email: string): never | void {
    if (!email) {
      throw new BadRequestError(ResponseMessage.EMPTY_EMAIL);
    }
    if (!this.emailPattern.test(email)) {
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
      username: this._accountName,
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

export type ISendEmail = {
  readonly subject: string;
  readonly pugFilename: string;
};

export abstract class SendEmail implements ISendEmail {
  public constructor(public readonly token: string) {}
  public abstract readonly subject: string;
  public abstract readonly pugFilename: string;
}

export class VerifyEmail extends SendEmail implements ISendEmail {
  public constructor(token: string) {
    super(token);
  }

  public readonly pugFilename: string = "verify-email.pug";
  public readonly subject: string = "Account Verification - Action Required";
}

export class ForgetEmail extends SendEmail implements ISendEmail {
  public constructor(token: string) {
    super(token);
  }

  public readonly pugFilename: string = "forget-password-email.pug";
  public readonly subject: string = "Reset Password";
}
