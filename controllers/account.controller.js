'use strict'

const jwt = require('jsonwebtoken')
const fs = require('node:fs')
const path = require('node:path')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')
const argon2 = require('argon2')
const { Account, Resume, Work } = require('../models')
const { authorize } = require('../utils')
const trimAllBody = require('../utils/trim-all-body')

const projection = {
    password: 0,
    verify: 0,
    hash: 0,
    forgetToken: 0,
    __v: 0
}

module.exports = {
    index,
    profile,
    show,
    update,
    destroy,
    trash,
    restore,
    eliminate,
    insert,
    workIndex,
    workShow,
    resume
}

/**
 *  Get All Accounts, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function index (req, res, next) {
    try {
        const withTrashed = req.query.trashed
        const option = { deletedAt: null }
        if (withTrashed) option.deletedAt = { $ne: null }
        const accounts = await Account.find(option, projection)
        res.status(StatusCodes.OK).send({ accounts })
    } catch (error) {
        next(error)
    }
}
/**
 * Create an account to the database, only admin has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function insert (req, res, next) {
    try {
        if (req.file) req.body.avatar = req.file.filename
        trimAllBody(req)
        req.body.verify = true
        req.body.password = await argon2.hash(req.body.password, { type: argon2.argon2i })
        const account = await Account.create(req.body)
        const { id } = account
        const token = jwt.sign({ id, name: req.body.name }, process.env.JWT_SECRET)
        res.status(StatusCodes.OK).send({ token })
    } catch (error) {
        next(error)
    }
}

/**
 * Show one account, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function show (req, res, next) {
    try {
        const { id } = req.params
        const account = await Account.findOne({ _id: id, deletedAt: null }, projection)
        res.status(StatusCodes.OK).send({ account })
    } catch (error) {
        next(error)
    }
}

/**
 * Update the existing account, the user of the account and admin has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function update (req, res, next) {
    try {
        const { id } = req.params
        authorize(req.user, id)
        req.body.updatedAt = Date.now()
        await Account.findOneAndUpdate(
            { _id: id, deletedAt: null },
            req.body
        )
        res.status(StatusCodes.OK).send({ message: 'Success Update Account' })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete one account not permanently, the user of the account and admin has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function destroy (req, res, next) {
    try {
        const { id } = req.params
        authorize(req.user, id)
        await Account.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { deletedAt: Date.now() }
        )
        res.status(StatusCodes.OK).send({ message: 'Account Deleted!' })
    } catch (error) {
        next(error)
    }
}
/**
 * Show all deleted account, admin has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function trash (req, res, next) {
    try {
        const accounts = await Account.find({ deletedAt: { $ne: null } })
        res.status(StatusCodes.OK).send({ accounts })
    } catch (error) {
        next(error)
    }
}

/**
 * Restore one of the deleted account, admin has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function restore (req, res, next) {
    try {
        const { id } = req.params
        await Account.findByIdAndUpdate(id, { deletedAt: null })
        res.status(StatusCodes.OK).send({ message: 'Account restored' })
    } catch (error) {
        next(error)
    }
}
/**
 * Delete one account PERMANENTLY becareful, admin has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function eliminate (req, res, next) {
    try {
        const { id } = req.params
        const account = await Account.findById(id)
        const { photo } = account
        await account.deleteOne()
        if (photo !== 'default-avatar.jpg') {
            fs.unlink(
                path.join(__dirname, '..', 'public', 'images', 'account', photo),
                (error) => {
                    if (error) throw error
                }
            )
        }
        res.status(StatusCodes.OK).send({ message: 'Account Clear' })
    } catch (error) {
        next(error)
    }
}
/**
 * Get information about my account, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function profile (req, res, next) {
    try {
        const { id } = req.user
        const account = await Account.findById(id, projection)
        res.status(StatusCodes.OK).send({ account })
    } catch (error) {
        next(error)
    }
}

/**
 * Get all works about an account, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function workIndex (req, res, next) {
    try {
        const { id } = req.params
        const works = await Work.find({ account_id: id, deletedAt: null })
        res.send({ works })
    } catch (error) {
        next(error)
    }
}

/**
 * Get a work about an account, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function workShow (req, res, next) {
    try {
        const { workId, id } = req.params
        const works = await Work.find({
            _id: workId,
            account_id: id,
            deletedAt: null
        })
        if (!works) throw new NotFoundError('Work Not Found')
        res.status(StatusCodes.OK).send({ works })
    } catch (error) {
        next(error)
    }
}

/**
 * Get a resume of an account, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function resume (req, res, next) {
    try {
        const { id } = req.params
        const resume = await Resume.findOne({ account_id: id })
        if (!resume) throw new NotFoundError('Resume Not Found')
        res.status(StatusCodes.OK).send({ resume })
    } catch (error) {
        next(error)
    }
}
