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
async function sendEmail (hash, to) {
    const transporter = await nodemailer()
    transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to,
        subject: 'Verify your email',
        text: 'Click The Verify Button To Verify',
        html: pug.renderFile(
            path.join(__dirname, '..', 'views', 'verify-email.pug'),
            { hash, domain, title: 'Email Verification' }
        )
    })
}

module.exports = sendEmail
