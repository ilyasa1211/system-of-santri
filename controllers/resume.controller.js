
'use strict'

/**
 * @type {import('mongoose').Model}
 */
const { Resume } = require('../models')
const { StatusCodes } = require('http-status-codes')
const { ConflictError } = require('../errors')

module.exports = { index, show, insert, destroy, update }

async function index (req, res, next) {
    try {
        const resumes = await Resume.find({}, {}, { sort: { createdAt: 'desc' } })
        res.status(StatusCodes.OK).send({ data: resumes })
    } catch (error) {
        next(error)
    }
}
async function show (req, res, next) {
    try {
        const resume = await Resume.findOne({ _id: req.params.id })
        res.status(StatusCodes.OK).send({ data: resume })
    } catch (error) {
        next(error)
    }
}
async function insert (req, res, next) {
    try {
        const { id } = req.user
        const hasResume = await Resume.exists({ account_id: id })
        if (hasResume) throw new ConflictError('Already have resume')
        req.body.account_id = id
        const resumes = await Resume.create(req.body)
        res.status(StatusCodes.OK).send({ message: 'Success creating resume!', data: resumes })
    } catch (error) {
        next(error)
    }
}
async function update (req, res, next) {
    try {
        const { id } = req.params
        await Resume.findByIdAndUpdate(id, req.body)
        res.status(StatusCodes.OK).send({ message: 'Success updating resume!' })
    } catch (error) {
        next(error)
    }
}

async function destroy (req, res, next) {
    try {
        const { id } = req.params
        await Resume.findByIdAndDelete(id)
        res.status(StatusCodes.OK).send({ message: 'Success deleting resume!' })
    } catch (error) {
        next(error)
    }
}
