const { UnauthorizedError } = require('../errors')
const { ADMIN } = require('../traits/role')
/**
 * Check if the account have the rights to do an action
 * @param {import('mongoose').Model} User
 * @param {import('mongoose').Model} Model
 * @param {Array} RoleException
 * @returns Boolean
 */
module.exports = function (User, Id, RoleException = [ADMIN]) {
    const hasTheRights = RoleException.find(role => User.role.id === role)
    const theOwner = Id === User.id
    if (!hasTheRights && !theOwner) throw new UnauthorizedError('You have no rights')
    return true
}
