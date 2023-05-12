
'use strict'

const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, UnauthorizedError, BadRequestError, ConflictError } = require('../errors')
const { Account } = require('../models')
const { sendVerifyEmail, sendForgetPasswordEmail, generateToken } = require('../utils')
const { EMAIL_PATTERNS } = require('../traits')
const { SANTRI } = require('../traits/role')

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
        if (!email) throw new BadRequestError('Email address is required')
        if (!password) throw new BadRequestError('Password is required')
        if (password.length < 8) throw new BadRequestError('Password minimal 8 character')
        if (!EMAIL_PATTERNS.test(email)) throw new BadRequestError('Please insert a valid email address')
        if (req.file) req.body.photo = req.file.filename
        const hash = generateToken()
        req.body.verify = false
        req.body.role = SANTRI
        req.body.hash = hash
        req.body.name = req.body.name.trim()
        req.body.email = req.body.email.trim()
        req.body.password = req.body.password.trim()
        req.body.phoneNumber = req.body.phoneNumber.trim()
        req.body.division = req.body.division.trim()
        req.body.status = req.body.status.trim()
        req.body.password = await argon2.hash(password, { type: argon2.argon2i })
        const account = await Account.create(req.body)
        const { id } = account
        const token = jwt.sign({ id, email, name }, process.env.JWT_SECRET)
        sendVerifyEmail(hash, email)
        res.send({ message: 'Please check your email to verify', token })
    } catch (error) {
        if (error.code === 11000) next(new ConflictError('Email already exists'))
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
        if (!email) throw new BadRequestError('Email address is required')
        if (!password) throw new BadRequestError('Password is required')
        if (!EMAIL_PATTERNS.test(email)) throw new BadRequestError('Please insert a valid email address')
        const account = await Account.findOne({ email, deletedAt: null, verify: true })
        if (!account) throw new NotFoundError('Account not found')
        const valid = await argon2.verify(account.password, password)
        if (!valid) throw new UnauthorizedError('Invalid password')
        const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET)
        res.status(StatusCodes.OK).send({ token })
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
        if (!account) throw new NotFoundError('Account has been verified')
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
        account.forgetToken = forgetToken
        await account.save()
        sendForgetPasswordEmail(forgetToken, email)
        res.send({ message: 'Check your email' })
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
        if (!password) throw new BadRequestError('Set your new password, don\'t forget it :)')
        if (!confirmPassword) throw new BadRequestError('Set confirmation password')
        if (password !== confirmPassword) throw new BadRequestError('Password and Confirmation Password does not match')
        let decoded
        jwt.verify(token, process.env.JWT_SECRET, (error, jwtPayload) => {
            if (error) throw new BadRequestError('Invalid Token')
            if (jwtPayload.exp < Date.now() / 1000) throw new UnauthorizedError('Token Expired')
            decoded = jwtPayload
        })
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
