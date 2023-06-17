"use strict";
module.exports = (error, request, response, next) => {
    if (typeof error.code !== "number" || error.code > 500 || error.code < 100) {
        error.code = 500;
    }
    return response.status(error.code || 500).json({ message: error.message });
};
