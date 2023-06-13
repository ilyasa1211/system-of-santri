"use strict";

const { NotFoundError } = require("../errors");

module.exports = async (request, response, next) =>
  next(new NotFoundError("Request URL Not Found"));
