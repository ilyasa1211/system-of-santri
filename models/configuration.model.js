"use strict";

const mongoose = require("mongoose");
const { generateToken } = require("../utils");

const configurationSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: true,
  },
  value: {
    type: String,
    default: generateToken(3),
  },
});

module.exports = new mongoose.model("Configuration", configurationSchema);
