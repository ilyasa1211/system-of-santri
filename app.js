
require('dotenv').config()
require('./config/db')
require('./config/passport')

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const { absenseRoute, accountRoute, authRoute, learningRoute, workRoute, resumeRoute, eventRoute, trashRoute, landingRoute, testRoute } = require('./routes')
const { error, notFound } = require('./middlewares')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', landingRoute)
app.use('/absense', absenseRoute)
app.use('/account', accountRoute)
app.use('/auth', authRoute)
app.use('/learning', learningRoute)
app.use('/work', workRoute)
app.use('/resume', resumeRoute)
app.use('/event', eventRoute)
app.use('/trash', trashRoute)
app.use('/test', testRoute)

app.use(notFound)
app.use(error)

module.exports = app
