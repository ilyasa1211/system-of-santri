"use strict";

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, "A date for the event should be chosen."],
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Please enter the event's name."],
  },
  slug: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

module.exports = new mongoose.model("Event", eventSchema);
