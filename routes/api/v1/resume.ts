

import express from "express";
import passport from "passport";
const router = express.Router();

import * as ResumeController from "../../../controllers/resume.controller";

router.get("/", ResumeController.index);
router.get("/:id", ResumeController.show);
router.use(passport.authenticate("jwt", { session: false }));
router.post("/", ResumeController.insert);
router.delete("/:id", ResumeController.destroy);
router.put("/:id", ResumeController.update);

export default router;
