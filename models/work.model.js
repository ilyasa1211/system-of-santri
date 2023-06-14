"use strict";

const mongoose = require("mongoose");

const workSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "account",
  },
  title: {
    type: String,
    required: [true, "For the required field, kindly enter a title."],
  },
  link: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = new mongoose.model("Work", workSchema);
