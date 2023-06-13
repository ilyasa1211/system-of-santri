"use strict";

const { NotFoundError } = require("../errors");

module.exports = async (request, response, next) =>
  next(
    new NotFoundError(
      "We are sorry for the trouble. The requested URL appears to be unavailable. Please verify the URL's accuracy by checking it twice. If you think this is a mistake, please get in touch with the relevant support staff or administrator for more information. ",
    ),
  );
