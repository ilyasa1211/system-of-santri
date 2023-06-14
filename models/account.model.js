"use strict";

const mongoose = require("mongoose");
const emailPattern = require("../traits/email-pattern");

require("./role.model");
require("./resume.model");

/**
 * @type {import('mongoose').Schema}
 */
const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "To continue, please enter your name."],
  },
  email: {
    type: String,
    maxLength: [
      320, // Email address maximum length
      "Email length is too long. Please type an email address that is no longer than 320 characters.",
    ],
    required: [
      true,
      "Please enter a working email address. Email is a necessary field.",
    ],
    unique: true,
    match: emailPattern,
  },
  password: {
    type: String,
    minLength: [
      8,
      "Please pick a password that is at least 8 characters long for the security of your account.",
    ],
    maxLength: [
      128,
      "Please select a password with a maximum of 128 characters",
    ],
    required: [
      true,
      "To ensure the security of your account, kindly provide a password.",
    ],
  },
  phoneNumber: {
    type: String,
    maxLength: [
      15,
      "Please enter a working phone number up to 15 characters in length.",
    ],
    required: [true, "Please enter a working phone number before continuing."],
  },
  division: {
    type: String,
    required: [true, "Please choose a division to continue."],
  },
  status: {
    type: String,
  },
  avatar: {
    type: String,
    default: "default-avatar.jpg",
  },
  santriPeriod: {
    type: String,
  },
  generation: {
    type: Number,
    default: 15,
  },
  generationYear: {
    type: String,
    default: 2090,
  },
  role: {
    type: Number,
    default: 3,
    ref: "Role",
  },
  absenses: {
    type: [String],
  },
  absense: {
    type: Number,
    ref: "Absense",
  },
  work: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Work" }],
  resume: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Resume",
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verifyExpiration: {
    type: Number,
    default: null,
  },
  forgetToken: {
    type: String,
    default: null,
  },
  hash: {
    type: String,
    default: null,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

accountSchema.pre("save", function (next) {
  // abense = 0 is for relation with absense model with id 0
  this.absense = 0;
  next();
});

module.exports = new mongoose.model("Account", accountSchema);
