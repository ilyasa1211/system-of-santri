"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const router = (0, express_1.Router)();
exports.default = router;
router.get("/", (request, response, next) => {
    return response.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Welcome to System of Santri",
    });
});
