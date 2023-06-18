import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../traits/errors";

export default async (
  request: Request,
  response: Response,
  next: NextFunction,
) =>
  next(
    new NotFoundError(
      "We are sorry for the trouble. The requested URL appears to be unavailable. Please verify the URL's accuracy by checking it twice. If you think this is a mistake, please get in touch with the relevant support staff or administrator for more information. ",
    ),
  );
