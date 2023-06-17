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
const errors_1 = require("../errors");
const passport_1 = __importDefault(require("passport"));
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
passport_1.default.use(new JwtStrategy(options, function (payload, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = payload;
            const account = yield models_1.Account.findOne({
                _id: id,
                deletedAt: null,
            }).populate({ path: "role", foreignField: "id" });
            if (!account) {
                throw new errors_1.NotFoundError("We apologize, but the requested account was not found.");
            }
            if (!account.verify) {
                throw new errors_1.UnauthorizedError("Please be aware that your account has not yet been verified, which we regret. A critical step in ensuring the safety and reliability of our platform is account verification. Please check your registered email for a verification link or further instructions before continuing. Please double-check your spam or junk folder if you haven't received a verification email. ");
            }
            return done(null, account);
        }
        catch (error) {
            console.log(error);
            done(error, false);
        }
    });
}));
