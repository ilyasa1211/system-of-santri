
'use strict'

const { ForbiddenError } = require('../errors')

module.exports = (...roles) => (req, res, next) => {
    try {
        if (req.isUnauthenticated()) throw new ForbiddenError('Login First')
        console.log(req.user)
        const hasRole = roles.find(role => req.user.role.id === role)
        const owner = roles.indexOf(0) !== -1
        if (!hasRole || owner) throw new ForbiddenError('No Access')
        next()
    } catch (error) {
        next(error)
    }
}
