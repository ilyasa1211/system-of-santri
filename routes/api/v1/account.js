
'use strict'

const express = require('express')
const router = express.Router()

const { AccountController } = require('../../../controllers')
const passport = require('passport')
const upload = require('../../../config/multer')('account')
const middleware = require('../../../middlewares')
const { ADMIN } = require('../../../traits/role')

router.use(upload.single('avatar'))

// Get All Accounts
router.get('/', AccountController.index)

// Show one account
router.get('/:id', AccountController.show)

// Get all works about an account
router.get('/:id/work', AccountController.workIndex)

// Get a work about an account
router.get('/:id/work/:workId', AccountController.workShow)

// Get a resume of an account
router.get('/:id/resume', AccountController.resume)

// All route below this will work for authenticated user only
router.use(passport.authenticate('jwt', { session: false }))

// Get information about my account
router.get('/me', AccountController.profile)

// Create an account to the database
router.post('/', middleware.accountIs(ADMIN), AccountController.insert)

// Update the existing account
router.put('/:id', AccountController.update)

// Delete one account not permanently
router.delete('/:id', AccountController.destroy)

// Verify a registered account
router.put('/:id/verify', middleware.accountIs(ADMIN), AccountController.verifyRegisteredAccount)

// reject a registered account
router.put('/:id/rejectVerify', middleware.accountIs(ADMIN), AccountController.rejectRegisteredAccount)

module.exports = router
