"use strict";

const path = require("node:path");
/**
 * @type {import('nodemailer').Transporter}
 */
const transporter = require("../config/nodemailer");
const pug = require("pug");
const getAccountUsername = require("./get-account-username");
const appUrl = process.env.APP_URL;
/**
 * Sending a forgot password email
 * @param {string} forgetToken
 * @param {Account} to
 */
async function sendForgetPasswordEmail(token, account) {
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

module.exports = sendForgetPasswordEmail;
