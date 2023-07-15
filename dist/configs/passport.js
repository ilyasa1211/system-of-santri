"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const errors_1 = require("../traits/errors");
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const response_1 = require("../traits/response");
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
const verifyCallback = function (payload, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = payload;
            const account = yield models_1.Account.findOne({
                _id: id,
                deletedAt: null,
            }).populate({ path: "role", foreignField: "id" });
            debugger;
            if (!account) {
                throw new errors_1.NotFoundError(response_1.ResponseMessage.ACCOUNT_NOT_FOUND);
            }
            if (!account.verify) {
                throw new errors_1.UnauthorizedError(response_1.ResponseMessage.UNVERIFIED_ACCOUNT);
            }
            return done(null, account);
        }
        catch (error) {
            done(error, false);
        }
    });
};
passport_1.default.use(new passport_jwt_1.Strategy(options, verifyCallback));
