"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (request, response, next) => {
    
        if (request.user) {
            return response.json({
                message: "You appear to be logged in already. You have complete access to all account-related features and functions.",
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
