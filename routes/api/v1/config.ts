import { Router } from "express";
import passport from "passport";
import * as middleware from "../../../middlewares";
import { AccessCode } from "../../../controllers/configuration";
import { ROLES } from "../../../traits/role";

const router = Router();
const accessCode = new AccessCode();

router.use(passport.authenticate("jwt", { session: false }));
router.use(middleware.accountIs(ROLES.ADMIN));

router.get("/access-code", accessCode.getAccessCode);
router.put("/access-code", accessCode.setAccessCode);

export default router;
