
'use strict'

const express = require('express')
const router = express.Router()

const passport = require('passport')
const { findOrCreate, refreshCalendar, refreshRole } = require('./utils')
const { Calendar, Role } = require('./models')

module.exports = router

router.use(passport.authenticate('jwt', { session: false }))
router.get('/', async (req, res, next) => {
    try {
        await refreshCalendar(Calendar, findOrCreate)
        await refreshRole(Role, findOrCreate)
        res.send({ account: req.user, message: 'Calendar refreshed, Role refreshed' })
    } catch (error) {
        next(error)
    }
})
