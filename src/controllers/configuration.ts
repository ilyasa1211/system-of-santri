import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/errors";
import { Request, Response } from "express";
import Configuration from "../models/configuration.model";

  export class ConfigurationController {
    public getConfiguration(key: string) {
      return async function getAccessCode(
        request: Request,
        response: Response,
      ) {
        const config = await Configuration.findOne({
          key: key,
        })
          .select(["key", "value"])
          .exec();

        if (!config) {
          throw new NotFoundError(
            `The ${key} configuration could not be found by the system. Please check your settings once more and try again.`,
          );
        }

        return response.status(StatusCodes.OK).json(config);
      };
    }
    public setConfiguration(key: string) {
      return async function setAccessCode(
        request: Request,
        response: Response,
      ) {
        const inputKey = request.body.key;
        if (!inputKey) {
          throw new BadRequestError(
            `Please enter the needed ${key} to continue.`,
          );
        }
        const { modifiedCount } = await Configuration.updateOne(
          { key: key },
          { value: inputKey },
        );

        if (!modifiedCount) {
          throw new Error(
            `Unfortunately, we must let you know that the attempt to set a new value for ${key} was unsuccessful.`,
          );
        }

        return response.status(StatusCodes.OK).json({
          message: `The ${key} has been successfully updated. The adjustments have been made.`,
        });
      };
    }
  }