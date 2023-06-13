const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.code = StatusCodes.UNAUTHORIZED;
  }
}
module.exports = UnauthorizedError;
