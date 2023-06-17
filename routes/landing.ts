import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

export default router;

router.get("/", (request: Request, response: Response, next: NextFunction) => {
  return response.status(StatusCodes.OK).json({
    message: "Welcome to System of Santri",
  });
});
