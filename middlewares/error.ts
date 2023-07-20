import { NextFunction, Request, Response } from "express";
import { ResponseMessage } from "../traits/response";
import { StatusCodes } from "http-status-codes";

export = (
	error: Error & { code: number },
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	if (error.message.startsWith("Cast to ObjectId failed")) {
		error.message = ResponseMessage.INVALID_ACCOUNT_ID;
		error.code = StatusCodes.BAD_REQUEST;
	} else if (error.message?.indexOf("duplicate key error") !== -1) {
		error.code = StatusCodes.CONFLICT;
		error.message = ResponseMessage.SIGNUP_CONFLICT;
	}
	if (typeof error.code !== "number" || error.code > 500 || error.code < 100) {
		error.code = 500;
	}
	return response.status(error.code || 500).json({ message: error.message });
};
