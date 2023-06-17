import { NextFunction, Request, Response } from "express";

export = (
  error: Error & { code: number },
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (typeof error.code !== "number" || error.code > 500 || error.code < 100) {
    error.code = 500;
  }
  return response.status(error.code || 500).json({ message: error.message });
};
