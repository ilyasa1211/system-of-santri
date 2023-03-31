
'use strict'

module.exports = (err, req, res, next) => {
    res.status(err.code || 500).send({ message: err.message })
}
