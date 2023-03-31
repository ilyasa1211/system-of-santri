
'use strict'

const { NotFoundError } = require('../errors')

module.exports = async (req, res, next) => next(new NotFoundError('Request URL Not Found'))
