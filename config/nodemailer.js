'use strict'

const nodemailer = require('nodemailer')

const host = process.env.SMTP_HOST
const port = process.env.SMTP_PORT
const user = process.env.SMTP_USERNAME
const pass = process.env.SMTP_PASSWORD

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }
})

module.exports = transport
