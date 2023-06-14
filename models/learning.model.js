"use strict";

const mongoose = require("mongoose");

const learningSchema = new mongoose.Schema({
  division: {
    type: String,
    required: [true, "Please choose a division to continue."],
  },
  thumbnail: {
    type: String,
    default: "default-thumbnail.jpg",
  },
  title: {
    type: String,
    required: [true, "Please include the entry's title."],
  },
  content: {
    type: String,
    required: [true, "Enter your entry's content please."],
  },
  goal: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = new mongoose.model("Learning", learningSchema);
