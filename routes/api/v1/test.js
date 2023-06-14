"use strict";

const express = require("express");
const router = express.Router();

const passport = require("passport");
const { findOrCreate, refreshCalendar, refreshRole } = require(
  "../../../utils",
);
const { Calendar, Role } = require("../../../models");

module.exports = router;

router.use(passport.authenticate("jwt", { session: false }));
router.get("/", async (request, response, next) => {
  try {
    await refreshCalendar(Calendar, findOrCreate);
    await refreshRole(Role, findOrCreate);
    return response.json({
      message: "Testing Succeed, Calendar refreshed, Role refreshed",
    });
  } catch (error) {
    next(error);
  }
});
