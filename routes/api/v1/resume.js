
'use strict'

const express = require('express')
const passport = require('passport')
const router = express.Router()

const ResumeController = require('../../../controllers/resume.controller')

router.use(passport.authenticate('jwt', { session: false }))

router.get('/', ResumeController.index)
router.get('/:id', ResumeController.show)
router.post('/', ResumeController.insert)
router.delete('/:id', ResumeController.destroy)
router.put('/:id', ResumeController.update)

module.exports = router
