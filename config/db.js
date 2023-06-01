'use strict'

const mongoose = require('mongoose')

const uri = process.env.MONGODB_CONNECTION_STRING

mongoose.set('strictQuery', true)
mongoose.connect(
    uri,
    () => console.info('Connected to DB')
)

module.exports = mongoose
