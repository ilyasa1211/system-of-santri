import { NextFunction, Request, Response } from "express";
import { ResponseMessage } from "../enums/response";

    export function guestOnly(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        if (request.isAuthenticated()) {
            return response.json({ message: ResponseMessage.ALREADY_LOGIN });
        }

        next();
    }