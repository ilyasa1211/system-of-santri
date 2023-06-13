"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
const { AccountController } = require("../../../controllers");
const { accountIs } = require("../../../middlewares");
const { ADMIN } = require("../../../traits/role");

router.use(passport.authenticate("jwt", { session: false }));
router.use(accountIs(ADMIN));

router.get("/account", AccountController.trash);
router.post("/account/:id", AccountController.restore);
router.delete("/account/:id", AccountController.eliminate);

module.exports = router;
