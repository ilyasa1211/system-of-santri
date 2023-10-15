import { StatusCodes } from "http-status-codes";
export class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.code = StatusCodes.BAD_REQUEST;
    }
}
export class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.code = StatusCodes.CONFLICT;
    }
}
export class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.code = StatusCodes.FORBIDDEN;
    }
}
export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.code = StatusCodes.NOT_FOUND;
    }
}
export class NotImplementedError extends Error {
    constructor(message) {
        super(message);
        this.code = StatusCodes.NOT_IMPLEMENTED;
    }
}
export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.code = StatusCodes.UNAUTHORIZED;
    }
}
