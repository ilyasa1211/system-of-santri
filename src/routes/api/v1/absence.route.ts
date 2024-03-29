import { Router } from "express";

import passport from "passport";
import { ROLES } from "../../../enums/role";
import { IRoutes } from "../../../interfaces/interfaces";
import AccountIs from "../../../middlewares/account-is";

export default class AbsenceRoute implements IRoutes {
  public constructor(
    private router: Router,
    // TODO: absence controller
    private controller: AbsenceController,
  ) {}

  public registerRoutes(): Router {
    this.router.use(passport.authenticate("jwt", { session: false }));
    this.router.get("/:id", this.controller.show);
    this.router.get(
      "/",
      AccountIs(ROLES.ADMIN, ROLES.MANAGER),
      this.controller.index,
    );
    this.router.post("/", AccountIs(ROLES.SANTRI), this.controller.insert);

    return this.router;
  }
}
