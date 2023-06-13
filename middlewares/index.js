"use strict";

const guest = require("./guest");
const accountIs = require("./account-is");
const error = require("./error");
const notFound = require("./not-found");

module.exports = { accountIs, guest, error, notFound };
