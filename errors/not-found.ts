import { StatusCodes } from "http-status-codes";

export default class NotFoundError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.NOT_FOUND;
  }
}
