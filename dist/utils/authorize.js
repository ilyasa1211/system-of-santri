"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const role_1 = require("../traits/role");
/**
 * Check if the account have the rights to do an action
 */
function default_1(account, id, roleException = [role_1.ROLES.ADMIN]) {
    const hasTheRights = roleException.find((role) => {
        const accountRole = account.role;
        return Number(accountRole.id) === role;
    });
    const theOwner = id === account.id;
    if (!hasTheRights && !theOwner) {
        throw new errors_1.UnauthorizedError("Access Is Refused. We regret to inform you that the requested action is not one for which you are authorized.");
    }
    return true;
}
exports.default = default_1;
;
