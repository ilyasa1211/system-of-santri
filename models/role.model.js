'use strict'

const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    }
})

module.exports = new mongoose.model('Role', roleSchema)
