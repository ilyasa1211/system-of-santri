
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
        unique: true
    },
    password: {
        type: String,
        minLength: [8, 'Password cannot be less than 8 characters'],
        required: [true, 'Password field required']
    },
    phoneNumber: {
        type: String,
        maxLength: [20, 'Phone number cannot be longer than 20 characters'],
        required: [true, 'Please enter your phone number']
    },
    division: {
        type: String,
        required: [true, 'Please enter your division']
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
