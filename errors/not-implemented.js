const { StatusCodes } = require("http-status-codes");

class NotImplementedError extends Error {
  constructor(message) {
    super(message);
    this.code = StatusCodes.NOT_IMPLEMENTED;
  }
}

module.exports = NotImplementedError;
