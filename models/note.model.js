'use strict'

const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    learning_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Learning'
    },
    note: {
        type: Number,
        require: [true, 'Insert Note']
    }
})

module.exports = mongoose.model('Note', noteSchema)
