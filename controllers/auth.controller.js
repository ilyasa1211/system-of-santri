
'use strict'

const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, UnauthorizedError, BadRequestError } = require('../errors')
const { Account } = require('../models')
const { sendVerifyEmail, sendForgetPasswordEmail, generateToken } = require('../utils')
const trimAllBody = require('../utils/trim-all-body')

module.exports = { signup, signin, verify, forgotPassword, resetPassword }

/**
 * Register an account
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function signup (req, res, next) {
    try {
        const { name, email, password } = req.body
        if (req.file) req.body.photo = req.file.filename
        const hash = generateToken()
        trimAllBody(req)
        req.body.verify = false
        req.body.hash = hash
        req.body.password = await argon2.hash(password, { type: argon2.argon2i })
        const account = await Account.create(req.body)
        const { id } = account
        const token = jwt.sign({ id, email, name }, process.env.JWT_SECRET)
        sendVerifyEmail(hash, email)
        res.send({ message: 'Please check your email to verify', token })
    } catch (error) {
        next(error)
    }
}

/**
 * Login to an account
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function signin (req, res, next) {
    try {
        const { email, password } = req.body
        const account = await Account.findOne({ email, deletedAt: null, verify: true })
        if (!account) throw new NotFoundError('Account not found')
        const valid = await argon2.verify(account.password, password)
        if (!valid) throw new UnauthorizedError('Invalid password')
        const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET)
        res.status(StatusCodes.OK).send({ message: 'Success signin', token })
    } catch (error) {
        next(error)
    }
}

/**
 * Verify an account
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function verify (req, res, next) {
    try {
        const hash = req.query.hash
        if (!hash) throw new BadRequestError('Token missing')
        const account = await Account.findOne({ hash })
        if (!account) throw new NotFoundError('Account not found')
        account.hash = null
        account.verify = true
        await account.save()
        res.status(StatusCodes.OK).send({ message: 'Account Verified' })
    } catch (error) {
        next(error)
    }
}

/**
 * When a user forgot their account password
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function forgotPassword (req, res, next) {
    try {
        const { email } = req.body
        if (!email) throw new BadRequestError('Email is required')
        const account = await Account.findOne({ email, deletedAt: null })
        if (!account) throw new NotFoundError('Account not found')
        const token = generateToken()
        const forgetToken = jwt.sign({ token }, process.env.JWT_SECRET, { expiresIn: '1h' })
        account.forgetToken = token
        await account.save()
        sendForgetPasswordEmail(forgetToken, email)
        res.send({ message: 'Please check your email' })
    } catch (error) {
        next(error)
    }
}

/**
 * Reset account password
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function resetPassword (req, res, next) {
    try {
        const { token } = req.query
        const { password, confirmPassword } = req.body

        if (!token) throw new BadRequestError('Token Invalid')
        if (!password) throw new BadRequestError('Please set your new password, don\'t forget it :)')
        if (password !== confirmPassword) throw new BadRequestError('Password and Confirmation Password does not match')
        let decoded
        jwt.verify(token, process.env.JWT_SECRET, (error, jwtPayload) => {
            if (error) throw new BadRequestError('Invalid Token')
            if (jwtPayload.exp < Date.now() / 1000) throw new UnauthorizedError('Token Expired')
            decoded = jwtPayload
        })
        console.log(decoded)
        const account = await Account.findOne({ forgetToken: decoded.token })
        if (!account) throw new NotFoundError('Account not found')
        account.password = await argon2.hash(password, { type: argon2.argon2i })
        account.forgetToken = null
        await account.save()
        res.status(StatusCodes.OK).send({ message: 'Password Change Successfully' })
    } catch (error) {
        next(error)
    }
}
