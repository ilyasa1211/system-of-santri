import { Router } from "express";
import passport from "passport";
import * as middleware from "../../../middlewares";
import { ConfigurationController } from "../../../controllers/configuration";
import { ROLES } from "../../../traits/role";

const router: Router = Router();
const config = new ConfigurationController();

router.use(passport.authenticate("jwt", { session: false }));
router.use(middleware.accountIs(ROLES.ADMIN, ROLES.MANAGER));

router.get("/access-code", config.getConfiguration("Access Code"));
router.put("/access-code", config.setConfiguration("Access Code"));

router.get("/absense-token", config.getConfiguration("Absense Token"));
router.put("/absense-token", config.setConfiguration("Absense Token"));

export default router;
