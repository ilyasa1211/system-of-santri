"use strict";

const express = require("express");
const router = express.Router();

module.exports = router;

router.get("/", (request, response, next) => {
  response.json({ message: "Welcome to System of Santri" });
});
