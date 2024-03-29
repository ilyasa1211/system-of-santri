import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import { WorkController } from "../../../controllers/work";
import AccountIs from "../../../middlewares/account-is";
import { IRoutes } from "../../../interfaces/interfaces";

export default class WorkRoute implements IRoutes {
  public constructor(
    private router: Router,
    private workController: WorkController,
  ) {}

  public registerRoutes() {
    this.router.use(passport.authenticate("jwt", { session: false }));
    this.router.get(
      "/work",
      AccountIs(ROLES.ADMIN, ROLES.MANAGER),
      this.workController.index,
    );

    this.router.use(AccountIs(ROLES.ADMIN, ROLES.MANAGER, ROLES.SANTRI));
    this.router.post("/work", this.workController.create);
    this.router.put("/work/:workId", this.workController.update);
    this.router.delete("/work/:workId", this.workController.destroy);
    this.router.get("/work/:workId", this.workController.show);

    return this.router;
  }
}
