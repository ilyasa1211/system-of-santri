
'use strict'

const { Calendar, Event } = require('../models')
const { StatusCodes } = require('http-status-codes')
const { ConflictError } = require('../errors')
const findOrCreate = require('../utils/find-or-create')
const MONTHS = require('../traits/month')

module.exports = { index, insert, update, destroy, calendar }

async function calendar (req, res, next) {
    try {
        const calendar = await findOrCreate(Calendar, { id: 0 })
        const events = await Event.find()
        events.forEach(event => {
            const { title, slug, date } = event
            const [month, day] = date.split('-').slice(1)
            calendar.months[MONTHS[month - 1]][day - 1].event?.push({ title, slug })
        })

        res.status(StatusCodes.OK).send({ calendar })
    } catch (error) {
        next(error)
    }
}

async function index (req, res, next) {
    try {
        const events = await Event.find()
        res.status(StatusCodes.OK).send({ events })
    } catch (error) {
        next(error)
    }
}

async function insert (req, res, next) {
    try {
        const event = await Event.create(req.body)
        res.status(StatusCodes.OK).send({ message: 'Event successfully created', event })
    } catch (error) {
        if (error.code === 11000) next(new ConflictError('Event already exists'))
        next(error)
    }
}

async function update (req, res, next) {
    try {
        const { slug } = req.params
        const event = await Event.findOneAndUpdate({ slug }, req.body)
        res.status(StatusCodes.OK).send({ message: 'Event successfully updated', event })
    } catch (error) {
        next(error)
    }
}
async function destroy (req, res, next) {
    try {
        const { slug } = req.params
        await Event.findOneAndDelete({ slug })
        res.status(StatusCodes.OK).send({ message: 'Event successfully deleted' })
    } catch (error) {
        next(error)
    }
}
