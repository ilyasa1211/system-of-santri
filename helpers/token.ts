import crypto from "node:crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IAccount } from "../models";
import { ExtractJwt } from "passport-jwt";
import { Request } from "express";
import { BadRequestError } from "../traits/errors";
import { ResponseMessage } from "../traits/response";

export default class Token {
	readonly #key: string = process.env.JWT_SECRET as string;

	public static generateRandomToken(length: number = 20) {
		return crypto.randomBytes(length).toString("hex");
	}
	public static generateJwtToken({ id, email, name }: IAccount): string {
		return jwt.sign({ id, email, name }, this.prototype.#key);
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
