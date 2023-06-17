import { StatusCodes } from "http-status-codes";

export default class ConflictError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = StatusCodes.CONFLICT;
  }
}
