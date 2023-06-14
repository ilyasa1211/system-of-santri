"use strict";

/**
 * @type {import('nodemailer').Transporter}
 */
const transporter = require("../config/nodemailer");
const pug = require("pug");
const path = require("node:path");
const { default: mongoose } = require("mongoose");
const getAccountUsername = require('./get-account-username');
/**
 * Sending email
 * @param {string} hash
 * @param {Account} account
 */
async function sendVerifyEmail(hash, account) {
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
        username: getAccountUsername(name)
      },
    ),
  });
}

module.exports = sendVerifyEmail;
