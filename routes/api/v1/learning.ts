import { Router } from "express";
import passport from "passport";
import * as middleware from "../../../middlewares";

import upload from "../../../configs/multer";
import { LearningController } from "../../../controllers";
import { ROLES } from "../../../traits/role";

const router: Router = Router();

router.get("/", LearningController.index);
router.get("/:id", LearningController.show);

router.use(passport.authenticate("jwt", { session: false }));
router.use(middleware.accountIs(ROLES.ADMIN, ROLES.MANAGER));

router.delete("/:id", LearningController.destroy);

router.use(
	upload(String(process.env.SAVE_LEARNING_THUMBNAIL)).single("thumbnail"),
);

router.post("/", LearningController.insert);
router.put("/:id", LearningController.update);

export default router;
