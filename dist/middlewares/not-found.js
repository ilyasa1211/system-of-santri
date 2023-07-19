"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../traits/errors");
exports.default = (_request, _response, next) => next(new errors_1.NotFoundError("We are sorry for the trouble. The requested URL appears to be unavailable. Please verify the URL's accuracy by checking it twice. If you think this is a mistake, please get in touch with the relevant support staff or administrator for more information. "));
