import { UnauthorizedError } from "../enums/errors";
import { ResponseMessage } from "../enums/response";
export default function AccountIs(...roles) {
  return (request, response, next) => {
    if (request.isUnauthenticated()) {
      throw new UnauthorizedError(ResponseMessage.UNAUTHENTICATED);
    }
    const account = request.user;
    const hasRole = roles.find((role) => account.role.id === role);
    if (!hasRole) {
      throw new UnauthorizedError(ResponseMessage.UNAUTHORIZED);
    }
    next();
  };
}
