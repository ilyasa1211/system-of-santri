const { StatusCodes } = require('http-status-codes')
const NotFoundError = require('../errors/not-found')
const { RegisterNotification: Notification } = require('../models')

async function indexRegisteredAccount (req, res, next) {
    try {
        const notifications = await Notification.find()
        if (!notifications) throw new NotFoundError('There is no notification')
        res.status(StatusCodes.OK).json({
            notifications,
            count: notifications.length
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { indexRegisteredAccount }
