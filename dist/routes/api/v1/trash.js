"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const controllers_1 = require("../../../controllers");
const middlewares_1 = require("../../../middlewares");
const role_1 = require("../../../traits/role");
const router = (0, express_1.Router)();
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.use((0, middlewares_1.accountIs)(role_1.ROLES.ADMIN));
router.get("/account", controllers_1.AccountController.trash);
router.post("/account/:id", controllers_1.AccountController.restore);
router.delete("/account/:id", controllers_1.AccountController.eliminate);
exports.default = router;
