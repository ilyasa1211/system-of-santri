
'use strict'

const passport = require('passport')
const { RegisterNotificationController } = require('../../../controllers')
const accountIs = require('../../../middlewares/account-is')
const { ADMIN } = require('../../../traits/role')
const router = require('express').Router()

router.use(passport.authenticate('jwt', { session: false }))

router.get('/', accountIs(ADMIN), RegisterNotificationController.indexRegisteredAccount)

module.exports = router
