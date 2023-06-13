"use strict";

module.exports = (request, response, next) => {
  try {
    if (request.user) {
      response.json({ message: "Already Login" });
    }
    next();
  } catch (error) {
    next(error);
  }
};
