import { StatusCodes } from "http-status-codes";

export class BadRequestError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.BAD_REQUEST;
  }
}

export class ConflictError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.CONFLICT;
  }
}

export class ForbiddenError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.FORBIDDEN;
  }
}

export class NotFoundError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.NOT_FOUND;
  }
}

export class NotImplementedError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.NOT_IMPLEMENTED;
  }
}

export class UnauthorizedError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.UNAUTHORIZED;
  }
}
