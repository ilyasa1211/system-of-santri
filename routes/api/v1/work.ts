import { Router } from "express";
import * as WorkController from "../../../controllers/work";
import * as middleware from "../../../middlewares";
import passport from "passport";
import { ROLES } from "../../../traits/role";

const router: Router =  Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get(
  "/",
  middleware.accountIs(ROLES.ADMIN, ROLES.MANAGER),
  WorkController.index,
);
router.post(
  "/",
  middleware.accountIs(ROLES.ADMIN, ROLES.MANAGER, ROLES.SANTRI),
  WorkController.insert,
);

router.use(middleware.accountIs(ROLES.ADMIN, ROLES.MANAGER, ROLES.SANTRI));

router.put("/:id", WorkController.update);
router.delete("/:id", WorkController.destroy);
router.get("/:id", WorkController.show);

export default router;
