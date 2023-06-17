

import express from "express";
const router = express.Router();

import passport from "passport";
import * as middleware from "../../../middlewares";

const upload = require("../../../config/multer")("learning");
import { LearningController } from "../../../controllers";
import { ROLES } from "../../../traits/role";

router.get("/", LearningController.index);
router.get("/:id", LearningController.show);

router.use(passport.authenticate("jwt", { session: false }));
router.use(middleware.accountIs(ROLES.ADMIN, ROLES.MANAGER));

router.use(upload.single("thumbnail"));

router.delete("/:id", LearningController.destroy);
router.post("/", LearningController.insert);
router.put("/:id", LearningController.update);

export default router;
