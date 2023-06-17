import transporter from "../config/nodemailer";
import pug from "pug";
import path from "node:path";
import { default as mongoose } from "mongoose";
import getAccountUsername from "./get-account-username";
import { IAccount } from "../models";
const appUrl = process.env.APP_URL;

/**
 * Send verify email
 */
export default async function sendVerifyEmail(hash: string, account: IAccount) {
  const { name, email } = account;
  transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Account Verification - Action Required",
    html: pug.renderFile(
      path.join(__dirname, "..", "views", "verify-email.pug"),
      {
        hash,
        appUrl,
        username: getAccountUsername(name),
      },
    ),
  });
}
