'use strict'

module.exports = (err, req, res, next) => {
    if (typeof err.code !== "number" || err.code > 500 || err.code < 100) err.code = 500
    res.status(err.code || 500).send({ message: err.message })
}
