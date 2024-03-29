import { IAccount, IUser } from "../models/account.model";
import { ROLES } from "../enums/role";
import { UnauthorizedError } from "../errors/errors";
import { HydratedDocument } from "mongoose";

/**
 * Check if the account have the rights to do an action
 */
export default function (
  user: Express.User | undefined,
  id: string,
  roleException: Array<ROLES> = [ROLES.ADMIN],
) {
  const account = user as HydratedDocument<IUser>;
  const hasTheRights = roleException.find((roleId: number) => {
    return Number(account.role) === roleId;
  });

  const theOwner: boolean = id === account.id;

  if (!hasTheRights && !theOwner) {
    throw new UnauthorizedError("Unauthorized!");
  }
  return true;
}
