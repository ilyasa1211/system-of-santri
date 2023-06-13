"use strict";

const { ForbiddenError } = require("../errors");

module.exports = (...roles) => (request, response, next) => {
  try {
    if (request.isUnauthenticated()) {
      throw new ForbiddenError(
        "Please log in with your credentials to continue with any account-related actions. You can perform a variety of tasks by logging in, which will give you the access and permissions you need.",
      );
    }
    const hasRole = roles.find((role) => request.user.role.id === role);
    if (!hasRole) {
      throw new ForbiddenError(
        "We regret any inconvenience this may have caused. Unfortunately, it seems that you lack the access rights needed to complete this task. ",
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
