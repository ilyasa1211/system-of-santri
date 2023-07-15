import { Account } from "../models";
import { NotFoundError, UnauthorizedError } from "../traits/errors";
import passport, { DoneCallback } from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback,
  VerifyCallback,
} from "passport-jwt";
import { ResponseMessage } from "../traits/response";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const verifyCallback: VerifyCallback = async function (
  payload: {
    id: string;
    email: string;
    name: string;
  },
  done: VerifiedCallback,
) {
  try {
    const { id } = payload;

    const account = await Account.findOne({
      _id: id,
      deletedAt: null,
    }).populate({ path: "role", foreignField: "id" });
    debugger;
    if (!account) {
      throw new NotFoundError(
        ResponseMessage.ACCOUNT_NOT_FOUND,
      );
    }
    if (!account.verify) {
      throw new UnauthorizedError(
        ResponseMessage.UNVERIFIED_ACCOUNT,
      );
    }
    return done(null, account);
  } catch (error: any) {
    done(error, false);
  }
};

passport.use(new JwtStrategy(options, verifyCallback));
