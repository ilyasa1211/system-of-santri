
'use strict'

const mongoose = require('mongoose')

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 27017
const DB_NAME = process.env.DB_NAME

mongoose.set('strictQuery', true)
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, () => console.info('Connected to DB'))

module.exports = mongoose
