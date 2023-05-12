'use strict'

module.exports = (err, req, res, next) => {
    if (err.code === 'ENOENT' || err.code === 11000) err.code = 500
    res.status(err.code || 500).send({ message: err.message })
}
