"use strict";

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, "Choose date"],
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Please input the event title"],
  },
  slug: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

module.exports = new mongoose.model("Event", eventSchema);
