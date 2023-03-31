
'use strict'

const express = require('express')
const passport = require('passport')
const router = express.Router()

const NoteController = require('../controllers/note.controller')
const { accountIs } = require('../middlewares')
const { MANAGER, ADMIN } = require('../traits/role')

router.use(passport.authenticate('jwt', { session: false }))

router.get('/', NoteController.index)
router.get('/:id', NoteController.show)

router.use(accountIs(ADMIN, MANAGER))

router.post('/', NoteController.insert)
router.delete('/:id', NoteController.destroy)
router.put('/:id', NoteController.update)

module.exports = router
