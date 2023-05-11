'use strict'

const nodemailer = require('nodemailer')

const host = process.env.MAIL_HOST
const port = process.env.MAIL_PORT
const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASS

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }
})

module.exports = transport
