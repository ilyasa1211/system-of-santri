import { IAccount } from "../models/account.model";
import { ROLES } from "../enums/role";
import { UnauthorizedError } from "../enums/errors";

/**
 * Check if the account have the rights to do an action
 */
export default function (
    user: Express.User | undefined,
    id: string,
    roleException: Array<ROLES> = [ROLES.ADMIN],
) {
    const account = user as IAccount;
    const hasTheRights = roleException.find((role: number) => {
        const accountRole = account.role;
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
