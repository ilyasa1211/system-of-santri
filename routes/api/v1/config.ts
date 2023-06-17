

import { Router } from "express";
const router = Router();

import passport from "passport";
import * as middleware from "../../../middlewares";

import { ConfigurationController } from "../../../controllers";
import { ROLES } from "../../../traits/role";

router.use(passport.authenticate("jwt", { session: false }));
router.use(middleware.accountIs(ROLES.ADMIN));

router.get("/access-code", ConfigurationController.getAccessCode);
router.put("/access-code", ConfigurationController.setAccessCode);

export default router;
