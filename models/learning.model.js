'use strict'

const mongoose = require('mongoose')

const learningSchema = new mongoose.Schema({
    division: {
        type: String
    },
    thumbnail: {
        type: String,
        default: 'default-thumbnail.jpg'
    },
    title: {
        type: String,
        required: [true, 'Please Insert the Title']
    },
    content: {
        type: String,
        required: [true, 'Please Insert the Content']
    },
    goal: {
        type: String,
        default: ''
    }
}, { timestamps: true })

module.exports = new mongoose.model('Learning', learningSchema)
