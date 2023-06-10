'use strict'

const mongoose = require('mongoose')

require('./role.model')
require('./resume.model')

/**
 * @type {import('mongoose').Schema}
 */
const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field required']
    },
    email: {
        type: String,
        maxLength: [255, 'Email cannot be longer than 255 characters'],
        required: [true, 'Email field required'],
        unique: [true, 'Please use another email'],
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        minLength: [8, 'Password cannot be less than 8 characters'],
        required: [true, 'Password field required']
    },
    phoneNumber: {
        type: String,
        maxLength: [20, 'Phone number cannot be longer than 20 characters'],
        required: [true, 'Phone number field required']
    },
    division: {
        type: String,
        required: [true, 'Division field required']
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
    verifyExpiration: {
        type: Number,
        default: null
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
    // abense = 0 is for relation with absense model with id 0
    this.absense = 0
    next()
})

module.exports = new mongoose.model('Account', accountSchema)
