import { StatusCodes } from "http-status-codes";

export default class ForbiddenError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.FORBIDDEN;
  }
}

