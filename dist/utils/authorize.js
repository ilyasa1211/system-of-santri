import { ROLES } from "../enums/role";
import { UnauthorizedError } from "../enums/errors";
/**
 * Check if the account have the rights to do an action
 */
export default function (user, id, roleException = [ROLES.ADMIN]) {
    const account = user;
    const hasTheRights = roleException.find((role) => {
        const accountRole = account.role;
        return Number(accountRole.id) === role;
    });
    const theOwner = id === account.id;
    if (!hasTheRights && !theOwner) {
        throw new UnauthorizedError("Access Is Refused. We regret to inform you that the requested action is not one for which you are authorized.");
    }
    return true;
}
