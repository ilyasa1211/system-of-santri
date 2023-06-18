import { IAccount } from "../models";
import { UnauthorizedError } from "../traits/errors";
import { ROLES } from "../traits/role";

/**
 * Check if the account have the rights to do an action
 */
export default function (
  account: IAccount,
  id: string,
  roleException = [ROLES.ADMIN],
) {
  const hasTheRights = roleException.find((role: number) => {
    const accountRole = <{ id: string; name: string }> account.role;
    return Number(accountRole.id) === role;
  });
  const theOwner: boolean = id === account.id;
  if (!hasTheRights && !theOwner) {
    throw new UnauthorizedError(
      "Access Is Refused. We regret to inform you that the requested action is not one for which you are authorized.",
    );
  }
  return true;
}
