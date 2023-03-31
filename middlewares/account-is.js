
'use strict'

const { ForbiddenError } = require('../errors')

module.exports = (...roles) => (req, res, next) => {
    try {
        if (req.isUnauthenticated()) throw new ForbiddenError('Login First')
        const hasRole = roles.find(role => req.user.role.id === role)
        if (!hasRole) throw new ForbiddenError('No Access')
        next()
    } catch (error) {
        next(error)
    }
}
