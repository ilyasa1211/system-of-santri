import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const router: Router =  Router();

export default router;

router.get("/", (request: Request, response: Response, next: NextFunction) => {
  const { onlineSince } = request as Request & { onlineSince: string };
  return response.status(StatusCodes.OK).json({
    message: "Welcome to System of Santri!",
    onlineSince,
  });
});
