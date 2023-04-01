
'use strict'

const express = require('express')
const router = express.Router()

const WorkController = require('../../../controllers/work.controller')
const middleware = require('../../../middlewares')
const passport = require('passport')
const { ADMIN, MANAGER, SANTRI } = require('../../../traits/role')

router.use(passport.authenticate('jwt', { session: false }))

router.get('/', middleware.accountIs(ADMIN, MANAGER), WorkController.index)
router.post('/', middleware.accountIs(ADMIN, MANAGER, SANTRI), WorkController.insert)

router.use(middleware.accountIs(SANTRI))

router.put('/:id', WorkController.update)
router.delete('/:id', WorkController.destroy)
router.get('/:id', WorkController.show)

module.exports = router
