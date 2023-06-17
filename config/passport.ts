import { Account } from "../models";
import { NotFoundError, UnauthorizedError } from "../errors";
import passport, { DoneCallback } from "passport";
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JwtStrategy(
    options,
    async function (
      payload: { id: string; email: string; name: string },
      done: DoneCallback,
    ) {
      try {
        const { id } = payload;
        console.log(id);
        const account = await Account.findOne({
          _id: id,
          deletedAt: null,
        }).populate({ path: "role", foreignField: "id" });
        if (!account) {
          throw new NotFoundError(
            "We apologize, but the requested account was not found.",
          );
        }
        if (!account.verify) {
          throw new UnauthorizedError(
            "Please be aware that your account has not yet been verified, which we regret. A critical step in ensuring the safety and reliability of our platform is account verification. Please check your registered email for a verification link or further instructions before continuing. Please double-check your spam or junk folder if you haven't received a verification email. ",
          );
        }
        return done(null, account);
      } catch (error: any) {
        console.log(error);
        done(error, false);
      }
    },
  ),
);
