
'use strict'

const express = require('express')
const router = express.Router()

const { EventController } = require('../controllers')
const passport = require('passport')
const middleware = require('../middlewares')
const { ADMIN, MANAGER, SANTRI } = require('../traits/role')

router.get('/', EventController.index)
router.get('/calendar', EventController.calendar)

router.use(passport.authenticate('jwt', { session: false }))

router.use(middleware.accountIs(ADMIN))
router.post('/', EventController.insert)
router.put('/:slug', EventController.update)
router.delete('/:slug', EventController.destroy)

module.exports = router
