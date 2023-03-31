
'use strict'

module.exports = (req, res, next) => {
    try {
        if (req.user) {
            res.send({ message: 'Already Login' })
        }
        next()
    } catch (err) {
        next(err)
    }
}
