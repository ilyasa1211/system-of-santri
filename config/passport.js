'use strict'

const { Account } = require('../models')
const { NotFoundError } = require('../errors')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}
passport.use(
    new JwtStrategy(options, async function ({ id }, done) {
        try {
            const account = await Account.findOne({
                _id: id,
                deletedAt: null,
            }).populate({ path: 'role', foreignField: 'id' })
            if (!account) throw new NotFoundError('Your Account not found')
            if (account.blocked) throw new UnauthorizedError('Your account is blocked')
            if (!account.verify) throw new UnauthorizedError('Your account is not verified')
            return done(null, account)
        } catch (error) {
            done(error, false)
        }
    })
)
