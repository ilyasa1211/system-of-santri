'use strict'

const { Calendar, Event } = require('../models')
const { StatusCodes } = require('http-status-codes')
const { ConflictError, NotFoundError } = require('../errors')
const findOrCreate = require('../utils/find-or-create')
const MONTHS = require('../traits/month')

module.exports = { index, insert, update, destroy, calendar }

/**
 * Get event calendar
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function calendar (req, res, next) {
    try {
        const calendar = await findOrCreate(Calendar, { id: 0 })
        const events = await Event.find()
        events.forEach((event) => {
            const { title, slug, date } = event
            const [month, day] = date.split('-').slice(1)
            calendar.months[MONTHS[month - 1]][day - 1].event?.push({ title, slug })
        })

        res.status(StatusCodes.OK).send({ calendar })
    } catch (error) {
        next(error)
    }
}

/**
 * Get normal calendar
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function index (req, res, next) {
    try {
        const events = await Event.find()
        res.status(StatusCodes.OK).send({ events })
    } catch (error) {
        next(error)
    }
}

/**
 * Create an event
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function insert (req, res, next) {
    try {
        await Event.create(req.body)
        res.status(StatusCodes.OK).send({ message: 'Event successfully created' })
    } catch (error) {
        next(error)
    }
}

/**
 * Update an event
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function update (req, res, next) {
    try {
        const { id } = req.params
        const event = await Event.findById(id)
        if (!event) throw new NotFoundError('Event not found')
        Object.assign(event, req.body)
        await event.save()
        res.status(StatusCodes.OK).send({ message: 'Event successfully updated' })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete an event
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function destroy (req, res, next) {
    try {
        const { id } = req.params
        await Event.findOneAndDelete({ _id: id })
        res.status(StatusCodes.OK).send({ message: 'Event successfully deleted' })
    } catch (error) {
        next(error)
    }
}
