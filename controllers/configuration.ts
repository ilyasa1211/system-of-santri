import { StatusCodes } from "http-status-codes";
import { Configuration } from "../models/configuration";
import { BadRequestError, NotFoundError } from "../traits/errors";
import { NextFunction, Request, Response } from "express";
import { CaseStyle } from "../utils";

export class ConfigurationController {
	public getConfiguration(key: string) {
		return async function getAccessCode(
			request: Request,
			response: Response,
			next: NextFunction,
		) {
			try {
				const KEY: CaseStyle = new CaseStyle(key);

				const config = await Configuration.findOne({
					key: KEY.toSnakeCase(),
				})
					.select(["key", "value"])
					.exec();
				if (!config) {
					throw new NotFoundError(
						`The ${key} configuration could not be found by the system. Please check your settings once more and try again.`,
					);
				}
				return response.status(StatusCodes.OK).json(config);
			} catch (error: unknown) {
				next(error);
			}
		};
	}
	public setConfiguration(key: string) {
		return async function setAccessCode(
			request: Request,
			response: Response,
			next: NextFunction,
		) {
			try {
				const KEY = new CaseStyle(key);
				const inputKey = request.body[KEY.toCamelCase()];
				if (!inputKey) {
					throw new BadRequestError(
						`Please enter the needed ${key} to continue.`,
					);
				}
				const { modifiedCount } = await Configuration.updateOne(
					{
						key: KEY.toSnakeCase(),
					},
					{
						value: inputKey,
					},
				);

				if (!modifiedCount) {
					throw new Error(
						`Unfortunately, we must let you know that the attempt to set a new ${key} was unsuccessful.`,
					);
				}

				return response.status(StatusCodes.OK).json({
					message: `The ${key} has been successfully updated. The adjustments have been made.`,
				});
			} catch (error: unknown) {
				next(error);
			}
		};
	}
}
