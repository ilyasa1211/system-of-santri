
'use strict'

const express = require('express')
const router = express.Router()

const { AccountController } = require('../controllers')
const passport = require('passport')
const upload = require('../config/multer')('account')
const middleware = require('../middlewares')
const { ADMIN, MANAGER, SANTRI } = require('../traits/role')

router.use(upload.single('avatar'))
router.use(passport.authenticate('jwt', { session: false }))
router.get('/me', AccountController.profile)

router.get('/', middleware.accountIs(ADMIN, MANAGER), AccountController.index)
router.get('/:id', AccountController.show)

router.get('/:id/work', AccountController.workIndex)
router.get('/:id/work/:workId', AccountController.workShow)

router.get('/:id/resume', AccountController.resume)

router.post('/', AccountController.insert)

router.put('/:id', AccountController.update)
router.delete('/:id', AccountController.destroy)

module.exports = router
