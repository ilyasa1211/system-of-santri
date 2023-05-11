'use strict'

const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '8892ac2c7a5642',
        pass: '342ae714350d72'
    }
})

module.exports = transport
