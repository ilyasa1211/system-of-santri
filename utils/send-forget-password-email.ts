import path from "node:path";
import transporter from "../config/nodemailer";
import pug from "pug";
import getAccountUsername from "./get-account-username";
import { IAccount } from "../models";

const appUrl = process.env.APP_URL;

/**
 * Sending a forgot password email
 */
export default async function sendForgetPasswordEmail(
  token: string,
  account: IAccount,
) {
  const { name, email } = account;
  transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Reset Password",
    html: pug.renderFile(
      path.join(__dirname, "..", "views", "forget-password-email.pug"),
      { token, appUrl, username: getAccountUsername(name) },
    ),
  });
}
