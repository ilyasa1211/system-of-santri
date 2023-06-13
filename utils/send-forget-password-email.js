"use strict";

const path = require("node:path");
/**
 * @type {import('nodemailer').Transporter}
 */
const transporter = require("../config/nodemailer");
const pug = require("pug");
const appUrl = process.env.APP_URL;
/**
 * Sending a forgot password email
 * @param {string} forgetToken
 * @param {string} to
 */
async function sendForgetPasswordEmail(token, to) {
  transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to,
    subject: "Reset Password",
    html: pug.renderFile(
      path.join(__dirname, "..", "views", "forget-password-email.pug"),
      { token, appUrl },
    ),
  });
}

module.exports = sendForgetPasswordEmail;
