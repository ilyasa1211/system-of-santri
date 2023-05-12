
'use strict'

const express = require('express')
const passport = require('passport')
const router = express.Router()

const ResumeController = require('../../../controllers/resume.controller')

router.get('/', ResumeController.index)
router.get('/:id', ResumeController.show)
router.use(passport.authenticate('jwt', { session: false }))
router.post('/', ResumeController.insert)
router.delete('/:id', ResumeController.destroy)
router.put('/:id', ResumeController.update)

module.exports = router
