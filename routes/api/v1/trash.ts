import { Router } from "express";
import passport from "passport";
import { AccountController } from "../../../controllers";
import { accountIs } from "../../../middlewares";
import { ROLES } from "../../../traits/role";

const router: Router =  Router();

router.use(passport.authenticate("jwt", { session: false }));
router.use(accountIs(ROLES.ADMIN));

router.get("/account", AccountController.trash);
router.post("/account/:id", AccountController.restore);
router.delete("/account/:id", AccountController.eliminate);

export default router;
