import { JwtPayload } from "jsonwebtoken";
import { Strategy } from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
  VerifiedCallback,
} from "passport-jwt";
import Account from "../models/account.model";
import AccountRepository from "../repositories/account.repository";
import { NotFoundError, UnauthorizedError } from "../errors/errors";
import { ResponseMessage } from "../enums/response";

export interface IStrategy {
  options: StrategyOptions;
  getStrategy: () => Strategy;
}

export class StrategyJWT implements IStrategy {
  public options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
  };

  public getStrategy() {
    return new JwtStrategy(this.options, async function (
      payload: JwtPayload,
      done: VerifiedCallback,
    ) {
      try {
        const { accountId } = payload;

        const accountRepository = new AccountRepository(Account);
        const account = await accountRepository.findById(accountId);

        if (!account) {
          throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
        }
        if (!account.verifyAt) {
          throw new UnauthorizedError(
            ResponseMessage.UNVERIFIED_ACCOUNT,
          );
        }
        return done(null, account);
      } catch (error: unknown) {
        done(error, false);
      }
    });
  }
}