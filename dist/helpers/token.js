var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Token_key;
import { BadRequestError } from "../enums/errors";
import { ExtractJwt } from "passport-jwt";
import { ResponseMessage } from "../enums/response";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
class Token {
    constructor() {
        _Token_key.set(this, process.env.JWT_SECRET);
    }
    static generateRandomToken(length = 20) {
        return crypto.randomBytes(length).toString("hex");
    }
    static generateJwtToken(data) {
        const { id, email, name } = data;
        const payload = { id, email, name };
        return jwt.sign(payload, __classPrivateFieldGet(this.prototype, _Token_key, "f"));
    }
    static getJwtToken(request) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        if (!token) {
            throw new BadRequestError("Please provide authorization header.");
        }
        return token;
    }
    static getJwtPayload(jwtToken) {
        let payload = undefined;
        jwt.verify(jwtToken, __classPrivateFieldGet(this.prototype, _Token_key, "f"), function (error, decoded) {
            payload = decoded;
            if (error) {
                throw new BadRequestError(ResponseMessage.TOKEN_FAILED);
            }
        });
        return payload;
    }
}
_Token_key = new WeakMap();
export default Token;
