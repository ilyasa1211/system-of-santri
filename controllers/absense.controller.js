'use strict'

const { Account } = require('../models')
const { StatusCodes } = require('http-status-codes')
const { ConflictError, BadRequestError } = require('../errors')
const { ATTEND } = require('../traits/absense')
const { MONTHS, STATUSES } = require('../traits')

module.exports = { index, insert, show, me }

/**
 * Show absense detail of all accounts
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function index (req, res, next) {
    try {
        const absenses = await Account.find({}, {
            name: 1,
            absense_id: 1,
            absenses: 1
        })
            .populate({ path: 'absense', foreignField: 'id' })

        absenses?.forEach((absense) => {
            absense?.absenses?.forEach((absens) => {
                const [day, month, status] = absens.split('/')
                absense.absense.months[MONTHS[month - 1]][day - 1].status =
          STATUSES[status - 1]
            })
        })
        res.status(StatusCodes.OK).send({ absenses })
    } catch (error) {
        next(error)
    }
}

/**
 * Show absense detail of my account
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function me (req, res, next) {
    try {
        const { id } = req.user
        const account = await Account.findById(id, {
            name: 1,
            absense: 1,
            absenses: 1
        }).populate({
            path: 'absense',
            foreignField: 'id',
            select: 'months -_id -id'
        })
        account?.absenses?.forEach((absens) => {
            const [day, month, status] = absens.split('/')
            account.absense.months[MONTHS[month - 1]][day - 1].status =
        STATUSES[status - 1]
        })
        res.status(StatusCodes.OK).send({ account })
    } catch (error) {
        next(error)
    }
}

/**
 * Show absense detail of an account
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function show (req, res, next) {
    try {
        const { id } = req.params
        const account = await Account.findById(id, {
            name: 1,
            absense: 1,
            absenses: 1
        }).populate({
            path: 'absense',
            foreignField: 'id',
            select: 'months -_id -id'
        })
        account.absense.forEach((absens) => {
            const [day, month, status] = absens.split('/')
            account.absense.months[MONTHS[month - 1]][day - 1].status =
        STATUSES[status - 1]
        })
        res.status(StatusCodes.OK).send({ account })
    } catch (error) {
        next(error)
    }
}

/**
 * Check for today absense of my account
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function insert (req, res, next) {
    try {
        const currentServerTime = new Intl.DateTimeFormat('id', { timeStyle: 'short' }).format()
        const currentHours = new Date().getHours()
        const lessonHours = 8
        if (currentHours !== lessonHours) {
            throw new BadRequestError('Sorry, absense closed! Please come back at ' + lessonHours + 'am.' + 'Current server time: ' + currentServerTime)
        }
        const account = req.user
        const status = ATTEND
        const date = new Intl.DateTimeFormat('id').format()
        const now = date.slice(0, date.lastIndexOf('/')).concat('/', status)
        const alreadyAbsent = account.absenses.find((array) =>
            array.toString() === now.toString()
        )
        if (alreadyAbsent) throw new ConflictError('Already Absent')
        account.absenses.push(now)
        await account.save()
        res.status(StatusCodes.OK).send({ message: 'Successfully Absent' })
    } catch (error) {
        next(error)
    }
}
