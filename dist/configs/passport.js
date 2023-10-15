import { ExtractJwt, Strategy as JwtStrategy, } from "passport-jwt";
import Account from "../models/account.model";
export class StrategyJWT {
    constructor() {
        this.options = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
            issuer: process.env.JWT_ISSUER,
        };
    }
    getStrategy() {
        return new JwtStrategy(this.options, async function (payload, done) {
            try {
                const { id } = payload;
                const account = await Account.findOne({
                    _id: id,
                    deletedAt: null,
                })
                    .populate("role", "id name -_id")
                    .exec();
                if (!account) {
                    throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
                }
                if (!account.verify) {
                    throw new UnauthorizedError(ResponseMessage.UNVERIFIED_ACCOUNT);
                }
                return done(null, account);
            }
            catch (error) {
                done(error, false);
            }
        });
    }
}
