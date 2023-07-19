import { NextFunction, Request, Response } from "express";

export default (request: Request, response: Response, next: NextFunction) => {
	try {
		if (request.user) {
			return response.json({
				message:
          "You appear to be logged in already. You have complete access to all account-related features and functions.",
			});
		}
		next();
	} catch (error: any) {
		next(error);
	}
};
