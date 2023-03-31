
'use strict'

const express = require('express')
const router = express.Router()

const { AuthController } = require('../controllers')
const upload = require('../config/multer')('account')
const middleware = require('../middlewares')

router.use(middleware.guest)
router.post('/signin', AuthController.signin)

router.get('/verify', AuthController.verify)

router.post('/forgot-password', AuthController.forgotPassword)
router.put('/forgot-password', AuthController.resetPassword)

router.use(upload.single('photo'))
router.post('/signup', AuthController.signup)

module.exports = router
