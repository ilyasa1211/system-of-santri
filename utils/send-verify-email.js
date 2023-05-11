
'use strict'

/**
 * @type {import('nodemailer').Transporter}
 */
const nodemailer = require('../config/nodemailer')
const pug = require('pug')
const path = require('node:path')
const domain = process.env.DOMAIN
/**
 * Sending email
 * @param {string} hash
 * @param {string} to
 */
function sendEmail (hash, to) {
    nodemailer.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to,
        subject: 'Verify your email',
        text: 'Click The Verify Button To Verify',
        html: pug.renderFile(path.join(__dirname, '..', 'views', 'verify-email.pug'), { hash, domain, title: 'Email Verification' })
    })
}

module.exports = sendEmail
