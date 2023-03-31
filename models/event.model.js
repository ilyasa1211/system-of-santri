
'use strict'

const mongoose = require('mongoose')
const { default: slugify } = require('slugify')

const eventSchema = new mongoose.Schema({
    date: {
        type: String,
        required: [true, 'Choose date'],
        match: /^\d{4}-\d{2}-\d{2}$/
        // example : 2023-03-20
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please input the event title']
    },
    slug: {
        type: String,
        unique: true
    }
}, { timestamps: true })

eventSchema.pre('save', function (next) {
    this.slug = slugify(this.title + this.date)
    next()
})

module.exports = new mongoose.model('Event', eventSchema)
