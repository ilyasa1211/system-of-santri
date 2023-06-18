"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traits_1 = require("../traits");
const role_1 = require("../traits/role");
function getRoleName(id) {
    return Object.keys(traits_1.ROLES)[id + role_1.ROLES_OFFSET];
}
exports.default = getRoleName;
