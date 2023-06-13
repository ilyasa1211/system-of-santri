const express = require("express");
const router = express.Router();
const {
  absenseRoute,
  accountRoute,
  authRoute,
  learningRoute,
  workRoute,
  resumeRoute,
  eventRoute,
  trashRoute,
  testRoute,
} = require("./api/v1");

module.exports = router;

router.use("/absense", absenseRoute);
router.use("/account", accountRoute);
router.use("/auth", authRoute);
router.use("/learning", learningRoute);
router.use("/work", workRoute);
router.use("/resume", resumeRoute);
router.use("/event", eventRoute);
router.use("/trash", trashRoute);
router.use("/test", testRoute);
