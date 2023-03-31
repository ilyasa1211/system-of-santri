const { StatusCodes } = require('http-status-codes')

class ConflictError extends Error {
    constructor (message) {
        super(message)
        this.code = StatusCodes.CONFLICT
    }
}

module.exports = ConflictError
