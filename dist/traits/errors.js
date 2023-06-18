"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.NotImplementedError = exports.NotFoundError = exports.ForbiddenError = exports.ConflictError = exports.BadRequestError = void 0;
const http_status_codes_1 = require("http-status-codes");
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.code = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
}
exports.BadRequestError = BadRequestError;
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.code = http_status_codes_1.StatusCodes.CONFLICT;
    }
}
exports.ConflictError = ConflictError;
class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.code = http_status_codes_1.StatusCodes.FORBIDDEN;
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.code = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
}
exports.NotFoundError = NotFoundError;
class NotImplementedError extends Error {
    constructor(message) {
        super(message);
        this.code = http_status_codes_1.StatusCodes.NOT_IMPLEMENTED;
    }
}
exports.NotImplementedError = NotImplementedError;
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.code = http_status_codes_1.StatusCodes.UNAUTHORIZED;
    }
}
exports.UnauthorizedError = UnauthorizedError;
