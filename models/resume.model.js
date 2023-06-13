"use strict";

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
  },
  technical_skill: {
    type: String,
    default: "",
  },
  education: {
    type: String,
    default: "",
  },
  personal_background: {
    type: String,
    default: "",
  },
  experience: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = new mongoose.model("Resume", resumeSchema);
