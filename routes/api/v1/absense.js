"use strict";

const express = require("express");
const router = express.Router();

const passport = require("passport");
const { AbsenseController } = require("../../../controllers");
const middleware = require("../../../middlewares");
const { ADMIN, MANAGER, SANTRI } = require("../../../traits/role");

router.use(passport.authenticate("jwt", { session: false }));
router.get("/me", AbsenseController.me);
router.get("/:id", AbsenseController.show);

router.get("/", middleware.accountIs(ADMIN, MANAGER), AbsenseController.index);

router.use(middleware.accountIs(ADMIN, MANAGER, SANTRI));
router.post("/", AbsenseController.insert);

module.exports = router;
