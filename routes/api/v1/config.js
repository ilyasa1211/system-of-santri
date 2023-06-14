"use strict";

const express = require("express");
const router = express.Router();

const passport = require("passport");
const middleware = require("../../../middlewares");

const { ConfigurationController } = require("../../../controllers");
const { ADMIN } = require("../../../traits/role");

router.use(passport.authenticate("jwt", { session: false }));
router.use(middleware.accountIs(ADMIN));

router.get("/access-code", ConfigurationController.getAccessCode);
router.put("/access-code", ConfigurationController.setAccessCode);

module.exports = router;
