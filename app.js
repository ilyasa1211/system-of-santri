require('dotenv').config()
require('./config/db')
require('./config/passport')

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const { error, notFound } = require('./middlewares')
const { v1, landingRoute } = require('./routes')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', landingRoute)
app.use('/api/v1', v1)

app.use(notFound)
app.use(error)

module.exports = app
