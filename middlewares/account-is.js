"use strict";

const { ForbiddenError } = require("../errors");

module.exports = (...roles) => (request, response, next) => {
  try {
    if (request.isUnauthenticated()) throw new ForbiddenError("Login First");
    const hasRole = roles.find((role) => request.user.role.id === role);
    if (!hasRole) throw new ForbiddenError("No Access");
    next();
  } catch (error) {
    next(error);
  }
};
