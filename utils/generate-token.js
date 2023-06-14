"use strict";

const crypto = require("node:crypto");

/**
 * Used to generated random string
 * @param {number} length
 * @returns string
 */
function generateToken(length = 20) {
  return crypto.randomBytes(length).toString("hex").toUpperCase();
}

module.exports = generateToken;
