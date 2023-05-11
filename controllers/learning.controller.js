'use strict'

const { Learning } = require('../models')
const { StatusCodes } = require('http-status-codes')
const fs = require('node:fs')
const path = require('node:path')

module.exports = { index, insert, update, destroy, show }

/**
 * Get all learnings
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
 * Show one learning
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
 * Create a new learning
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function insert (req, res, next) {
    try {
        const learnings = await Learning.create(req.body)
        res.status(StatusCodes.OK).send({ message: 'Created!', learnings })
    } catch (error) {
        next(error)
    }
}

/**
 * Update an existing learning
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function update (req, res, next) {
    try {
        const learnings = await Learning.findByIdAndUpdate(req.params.id, req.body)
        res.status(StatusCodes.OK).send({ message: 'Updated!', learnings })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a learning
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function destroy (req, res, next) {
    try {
        const learning = await Learning.findById(req.params.id)
        const photo = { learning }
        if (photo !== 'default-thumbnail.jpg') {
            fs.unlink(
                path.join(__dirname, '..', 'public', 'images', photo),
                (error) => {
                    if (error) throw error
                }
            )
        }
        await learning.deleteOne()
        res.status(StatusCodes.OK).send({ message: 'Deleted!', learning })
    } catch (error) {
        next(error)
    }
}
