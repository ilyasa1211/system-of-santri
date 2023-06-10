'use strict'

const mongoose = require('mongoose')

const registerNotificationSchema = new mongoose.Schema({
    title: String,
    account_id: String,
    read: Boolean
})

module.exports = mongoose.model('Notification', registerNotificationSchema)
