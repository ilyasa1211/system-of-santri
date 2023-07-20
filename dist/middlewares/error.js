"use strict";
const response_1 = require("../traits/response");
const http_status_codes_1 = require("http-status-codes");
module.exports = (error, request, response, next) => {
    var _a;
    if (error.message.startsWith("Cast to ObjectId failed")) {
        error.message = response_1.ResponseMessage.INVALID_ACCOUNT_ID;
        error.code = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    else if (((_a = error.message) === null || _a === void 0 ? void 0 : _a.indexOf("duplicate key error")) !== -1) {
        error.code = http_status_codes_1.StatusCodes.CONFLICT;
        error.message = response_1.ResponseMessage.SIGNUP_CONFLICT;
    }
    if (typeof error.code !== "number" || error.code > 500 || error.code < 100) {
        error.code = 500;
    }
    return response.status(error.code || 500).json({ message: error.message });
};
