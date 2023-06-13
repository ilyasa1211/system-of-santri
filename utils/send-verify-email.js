"use strict";

/**
 * @type {import('nodemailer').Transporter}
 */
const transporter = require("../config/nodemailer");
const pug = require("pug");
const path = require("node:path");
const appUrl = process.env.APP_URL;
/**
 * Sending email
 * @param {string} hash
 * @param {string} to
 */
async function sendVerifyEmail(hash, to) {
  transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to,
    subject: "Account Verification - Action Required",
    html: pug.renderFile(
      path.join(__dirname, "..", "views", "verify-email.pug"),
      { hash, appUrl },
    ),
  });
}

module.exports = sendVerifyEmail;
