
'use strict'

const express = require('express')
const router = express.Router()

const { EventController } = require('../../../controllers')
const passport = require('passport')
const middleware = require('../../../middlewares')
const { ADMIN } = require('../../../traits/role')

router.get('/', EventController.index)
router.get('/calendar', EventController.calendar)

router.use(passport.authenticate('jwt', { session: false }))

router.use(middleware.accountIs(ADMIN))
router.post('/', EventController.insert)
router.put('/:id', EventController.update)
router.delete('/:id', EventController.destroy)

module.exports = router
