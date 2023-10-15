import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";
import { UnauthorizedError } from "../enums/errors";
import { ResponseMessage } from "../enums/response";
import { TAccount } from "../types/account";

export default function accountIs(...roles: Array<number>) {
    return (request: Request, response: Response, next: NextFunction) => {
        if (request.isUnauthenticated()) {
            throw new UnauthorizedError(ResponseMessage.UNAUTHENTICATED);
        }
        const account = request.user as TAccount;
        const hasRole: number | undefined = roles.find(
            (role: number) =>
                (account.role as { id: ObjectId | number; name: string }).id ===
                role,
        );
        if (!hasRole) {
            throw new UnauthorizedError(ResponseMessage.UNAUTHORIZED);
        }
        next();
    };
}
