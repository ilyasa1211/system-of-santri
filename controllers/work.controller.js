
'use strict'

const { Work, Account } = require('../models')
const { StatusCodes } = require('http-status-codes')
const { authorize } = require('../utils')

module.exports = { index, insert, update, destroy, show }

async function index (req, res, next) {
    try {
        const works = await Work.find({}, {}, { sort: { createdAt: 'desc' } })
        res.status(StatusCodes.OK).send({ works })
    } catch (error) {
        next(error)
    }
}
async function show (req, res, next) {
    try {
        const work = await Work.findOne({ _id: req.params.id })
        res.status(StatusCodes.OK).send({ work })
    } catch (error) {
        next(error)
    }
}
async function insert (req, res, next) {
    try {
        req.body.account_id = req.user.id
        const works = await Work.create(req.body)
        const account = await Account.findById(req.user.id)
        account.work.push(works.id)
        await account.save()
        res.status(StatusCodes.OK).send({ message: 'Success creating!', works })
    } catch (error) {
        next(error)
    }
}
async function update (req, res, next) {
    try {
        const { id } = req.params
        const { user } = req
        const { title, link } = req.body
        const work = await Work.findById(id)
        authorize(user, work)
        if (title) work.title = title
        if (link) work.link = link
        await work.save()
        res.status(StatusCodes.OK).send({ message: 'Success updating!', work })
    } catch (error) {
        next(error)
    }
}

async function destroy (req, res, next) {
    try {
        const { id } = req.params
        const { user } = req
        const work = await Work.findById(id)
        authorize(user, work)
        await work.deleteOne()
        res.status(StatusCodes.OK).send({ message: 'Success deleting!' })
    } catch (error) {
        next(error)
    }
}
