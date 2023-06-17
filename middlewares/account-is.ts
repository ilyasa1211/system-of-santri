import { NextFunction, Request, Response } from "express";

import { ForbiddenError, UnauthorizedError } from "../errors";
import { IAccount } from "../models";
import { ObjectId } from "mongoose";

export default (...roles: Array<number>) =>
(request: Request, response: Response, next: NextFunction) => {
  try {
    if (request.isUnauthenticated()) {
      throw new UnauthorizedError(
        "Please log in with your credentials to continue with any account-related actions. You can perform a variety of tasks by logging in, which will give you the access and permissions you need.",
      );
    }
    const account = request.user as IAccount;
    const hasRole: number | undefined = roles.find((role) =>
      (account.role as { id: ObjectId | number; name: string }).id === role
    );
    if (!hasRole) {
      throw new UnauthorizedError(
        "We regret any inconvenience this may have caused. Unfortunately, it seems that you lack the access rights needed to complete this task. ",
      );
    }
    next();
  } catch (error: any) {
    next(error);
  }
};
