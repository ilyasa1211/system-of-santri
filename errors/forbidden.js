const { StatusCodes } = require("http-status-codes");

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.code = StatusCodes.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
