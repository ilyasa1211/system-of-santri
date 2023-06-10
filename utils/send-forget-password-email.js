'use strict'

const path = require('node:path')
/**
 * @type {import('nodemailer').Transporter}
 */
const transporter = require('../config/nodemailer')
const pug = require('pug')
const domain = process.env.DOMAIN
/**
 * Sending a forgot password email
 * @param {string} forgetToken
 * @param {string} to
 */
async function sendForgetPasswordEmail (forgetToken, to) {
    transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to,
        subject: 'Reset Password',
        text: 'Reset Your Password',
        html: pug.renderFile(path.join(__dirname, '..', 'views', 'forget-password-email.pug'), {
            forgetToken,
            domain,
            title: 'Reset Password'
        })
    })
}

module.exports = sendForgetPasswordEmail
