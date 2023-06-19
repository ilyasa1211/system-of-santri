import { StatusCodes } from "http-status-codes";
import { Configuration } from "../models/configuration";
import { BadRequestError, NotFoundError } from "../traits/errors";
import { NextFunction, Request, Response } from "express";

export class AccessCode {
  public async getAccessCode(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const config = await Configuration.findOne({ key: "access_code" });
      if (!config) {
        throw new NotFoundError(
          "The Access Code configuration could not be found by the system. Please check your settings once more and try again.",
        );
      }
      return response.status(StatusCodes.OK).json(config);
    } catch (error: any) {
      next(error);
    }
  }

  public async setAccessCode(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { accessCode } = request.body;
      if (!accessCode) {
        throw new BadRequestError(
          "Please enter the needed access code to continue.",
        );
      }
      const { modifiedCount } = await Configuration.updateOne({
        key: "access_code",
      }, {
        value: accessCode,
      });

      if (!modifiedCount) {
        throw new Error(
          "Unfortunately, we must let you know that the attempt to set a new access code was unsuccessful.",
        );
      }

      return response.status(StatusCodes.OK).json({
        message:
          "The access code has been successfully updated. The adjustments have been made.",
      });
    } catch (error: any) {
      next(error);
    }
  }
}
