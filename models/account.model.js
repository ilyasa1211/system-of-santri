
'use strict'

const mongoose = require('mongoose')

require('./role.model')
require('./resume.model')

/**
 * @type {import('mongoose').Schema}
 */
const accountSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    division: {
        type: String
    },
    status: {
        type: String
    },
    avatar: {
        type: String,
        default: 'default-avatar.jpg'
    },
    santriPeriod: {
        type: String
    },
    generation: {
        type: Number,
        default: 15
    },
    generationYear: {
        type: String,
        default: 2090
    },
    role: {
        type: Number,
        default: 3,
        ref: 'Role'
    },
    absenses: {
        type: [String]
    },
    absense: {
        type: Number,
        ref: 'Absense'
    },
    work: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Work' }],
    resume: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Resume'
    },
    verify: {
        type: Boolean,
        default: false
    },
    forgetToken: {
        type: String,
        default: null
    },
    hash: {
        type: String,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

accountSchema.pre('save', function (next) {
    this.role_id = 3
    this.absense = 0
    next()
})

module.exports = new mongoose.model('Account', accountSchema)
