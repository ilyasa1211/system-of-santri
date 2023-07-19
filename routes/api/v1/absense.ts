import { Router } from "express";

import passport from "passport";
import { AbsenseController } from "../../../controllers";
import * as middleware from "../../../middlewares";
import { ROLES } from "../../../traits/role";

const router: Router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/me", AbsenseController.me);
router.get("/:id", AbsenseController.show);

router.get(
	"/",
	middleware.accountIs(ROLES.ADMIN, ROLES.MANAGER),
	AbsenseController.index,
);

router.post("/", middleware.accountIs(ROLES.SANTRI), AbsenseController.insert);

export default router;
