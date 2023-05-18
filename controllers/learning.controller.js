'use strict'

const { Learning } = require('../models')
const { StatusCodes } = require('http-status-codes')
const fs = require('node:fs')
const path = require('node:path')
const NotFoundError = require('../errors/not-found')

module.exports = { index, insert, update, destroy, show }

/**
 * Get all learnings, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function index (req, res, next) {
    try {
        const learnings = await Learning.find()
        res.status(StatusCodes.OK).send({ learnings })
    } catch (error) {
        next(error)
    }
}

/**
 * Show one learning, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function show (req, res, next) {
    try {
        const learning = await Learning.findById(req.params.id)
        res.status(StatusCodes.OK).send({ learning })
    } catch (error) {
        next(error)
    }
}

/**
 * Create a new learning, manager has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function insert (req, res, next) {
    try {
        if (req.file) {
            req.body.thumbnail = req.file.filename
        }
        await Learning.create(req.body)
        res.status(StatusCodes.OK).send({ message: 'Success Created!' })
    } catch (error) {
        next(error)
    }
}

/**
 * Update an existing learning, manager has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function update (req, res, next) {
    try {
        if (req.file) {
            req.body.thumbnail = req.file.filename
        }
        const learning = await Learning.findById(req.params.id)
        if (!learning) throw NotFoundError('Learning not found')
        Object.assign(learning, req.body)
        await learning.save()
        res.status(StatusCodes.OK).send({ message: 'Success Updated!' })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a learning, manager has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function destroy (req, res, next) {
    try {
        const learning = await Learning.findById(req.params.id)
        if (!learning) throw new NotFoundError('Learning not found')
        const { thumbnail } = learning
        if (thumbnail && thumbnail !== 'default-thumbnail.jpg') {
            fs.unlink(
                path.join(__dirname, '..', 'public', 'images', process.env.SAVE_LEARNING_THUMBNAIL, thumbnail),
                (error) => {
                    if (error) throw error
                }
            )
        }
        await learning.deleteOne()
        res.status(StatusCodes.OK).send({ message: 'Success Deleted!' })
    } catch (error) {
        next(error)
    }
}
