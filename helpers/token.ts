import { BadRequestError } from "../enums/errors";
import { ExtractJwt } from "passport-jwt";
import { IAccount } from "../models/account.model";
import { Request } from "express";
import { ResponseMessage } from "../enums/response";
import crypto from "node:crypto";
import jwt, { JwtPayload } from "jsonwebtoken";

export default class Token {
    readonly #key: string = process.env.JWT_SECRET as string;

    public static generateRandomToken(length: number = 20) {
        return crypto.randomBytes(length).toString("hex");
    }
    public static generateJwtToken(data: IAccount): string {
        const { id, email, name } = data;
        const payload = { id, email, name };
        return jwt.sign(payload, this.prototype.#key);
    }
    public static getJwtToken(request: Request): string | never {
        const token: string | null =
            ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        if (!token) {
            throw new BadRequestError("Please provide authorization header.");
        }
        return token;
    }
    public static getJwtPayload(jwtToken: string):
        | never
        | undefined
        | (JwtPayload & {
              id: string;
              name: string;
              email: string;
          }) {
        let payload = undefined;
        jwt.verify(jwtToken, this.prototype.#key, function (error, decoded) {
            payload = decoded as JwtPayload & {
                id: string;
                name: string;
                email: string;
            };
            if (error) {
                throw new BadRequestError(ResponseMessage.TOKEN_FAILED);
            }
        });
        return payload;
    }
}
