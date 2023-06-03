require('dotenv').config()
require('./config/db')
require('./config/passport')

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const schedule = require('node-schedule')
const { Calendar } = require('./models')
const { error, notFound } = require('./middlewares')
const { v1, landingRoute } = require('./routes')
const { refreshCalendar, findOrCreate } = require('./utils')

// Define the cron expression for January 1st at 00:00
const cronExpression = '0 0 0 1 1 *'

// Schedule the task to run on the defined cron expression
const job = schedule.scheduleJob(cronExpression, async () => {
    await refreshCalendar(Calendar, findOrCreate)
    console.log('Calendar Refreshed!')
})
job.invoke()

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
