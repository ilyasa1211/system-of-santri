/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseMessage } from "../enums/response";

export default function ErrorHandler(
  error: Error & { code: number },
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error.message.startsWith("Cast to ObjectId failed")) {
    error.message = ResponseMessage.INVALID_ACCOUNT_ID;
    error.code = StatusCodes.BAD_REQUEST;
  } else if (error.message?.indexOf("duplicate key error") !== -1) {
    error.code = StatusCodes.CONFLICT;
    error.message = ResponseMessage.SIGNUP_CONFLICT;
  } else if (
    typeof error.code !== "number" ||
    error.code > 500 ||
    error.code < 100
  ) {
    error.code = 500;
  }

  return response.status(error.code || 500).json({ message: error.message });
}
