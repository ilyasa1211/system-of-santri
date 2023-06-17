import { StatusCodes } from "http-status-codes";

export default class BadRequestError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.BAD_REQUEST;
  }
}