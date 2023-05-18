
'use strict'

const express = require('express')
const router = express.Router()

const passport = require('passport')
const middleware = require('../../../middlewares')

const upload = require('../../../config/multer')('learning')
const { LearningController } = require('../../../controllers')
const { ADMIN, MANAGER } = require('../../../traits/role')

router.get('/', LearningController.index)
router.get('/:id', LearningController.show)

router.use(passport.authenticate('jwt', { session: false }))
router.use(middleware.accountIs(ADMIN, MANAGER))

router.use(upload.single('thumbnail'))

router.delete('/:id', LearningController.destroy)
router.post('/', LearningController.insert)
router.put('/:id', LearningController.update)

module.exports = router
