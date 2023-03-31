
'use strict'

const mongoose = require('mongoose')

const absenseSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: 0
    },
    year: {
        type: Number
    },
    months: {
        type: Object
    }
}, { timestamps: true })

absenseSchema.pre('save', function (next) {
    this.months = require('../utils/calendar')()
    this.id = 0
    this.year = new Date().getFullYear()
    next()
})

module.exports = new mongoose.model('Absense', absenseSchema)
