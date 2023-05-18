'use strict'

const multer = require('multer')
const path = require('node:path')
const crypto = require('node:crypto')

module.exports = function (paths) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '..', 'public', 'images', paths))
        },
        filename: function (req, file, cb) {
            const { mimetype } = file
            const fileExt = mimetype.slice(mimetype.indexOf('/') + 1)
            cb(null, crypto.randomUUID().concat('.', fileExt))
        }
    })
    return multer({ storage })
}
