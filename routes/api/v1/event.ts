import { Router } from "express";
const router: Router = Router();

import { EventController } from "../../../controllers";
import passport from "passport";
import * as middleware from "../../../middlewares";
import { ROLES } from "../../../traits/role";

router.get("/", EventController.index);
router.get("/calendar", EventController.calendar);

router.use(passport.authenticate("jwt", { session: false }));

router.use(middleware.accountIs(ROLES.ADMIN));
router.post("/", EventController.insert);
router.put("/:id", EventController.update);
router.delete("/:id", EventController.destroy);

export default router;
