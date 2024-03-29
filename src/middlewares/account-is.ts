import { NextFunction, Request, Response } from "express";
import { HydratedDocument, ObjectId } from "mongoose";
import { UnauthorizedError } from "../errors/errors";
import { ResponseMessage } from "../enums/response";
import { IAccount } from "../models/account.model";


export default function RoleIs(...roles: Array<number>) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (request.isUnauthenticated()) {
      throw new UnauthorizedError(ResponseMessage.UNAUTHENTICATED);
    }
    const account = request.user as HydratedDocument<IAccount>;
    const hasRole: number | undefined = roles.find(
      (role: number) =>
        (account.role as { id: ObjectId | number; name: string }).id === role,
    );
    if (!hasRole) {
      throw new UnauthorizedError(ResponseMessage.UNAUTHORIZED);
    }
    next();
  };
}
