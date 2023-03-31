const { StatusCodes } = require('http-status-codes')

class BadRequestError extends Error {
    constructor (message) {
        super(message)
        this.code = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestError
