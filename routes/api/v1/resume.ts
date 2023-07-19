import { Router } from "express";
import passport from "passport";
import * as ResumeController from "../../../controllers/resume";

const router: Router = Router();

router.get("/", ResumeController.index);
router.get("/account/:accountUniqueId", ResumeController.getByAccount);
router.get("/:id", ResumeController.show);

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", ResumeController.insert);
router.delete("/:id", ResumeController.destroy);
router.put("/:id", ResumeController.update);

export default router;
