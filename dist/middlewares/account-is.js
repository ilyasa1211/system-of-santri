"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../traits/errors");
exports.default = (...roles) => (request, response, next) => {
    try {
        if (request.isUnauthenticated()) {
            throw new errors_1.UnauthorizedError("Please log in with your credentials to continue with any account-related actions. You can perform a variety of tasks by logging in, which will give you the access and permissions you need.");
        }
        const account = request.user;
        debugger;
        const hasRole = roles.find((role) => account.role.id === role);
        if (!hasRole) {
            throw new errors_1.UnauthorizedError("We regret any inconvenience this may have caused. Unfortunately, it seems that you lack the access rights needed to complete this task. ");
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
