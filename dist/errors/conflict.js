"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.code = http_status_codes_1.StatusCodes.CONFLICT;
    }
}
exports.default = ConflictError;
