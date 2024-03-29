import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import { ConfigurationController } from "../../../controllers/configuration";
import { IRoutes } from "../../../interfaces/interfaces";
import AccountIs from "../../../middlewares/account-is";

export default class ConfigRoute implements IRoutes {
  public constructor(
    private router: Router,
    private configController: ConfigurationController,
  ) {}

  public registerRoutes() {
    this.router.use(passport.authenticate("jwt", { session: false }));
    this.router.use(AccountIs(ROLES.ADMIN, ROLES.MANAGER));

    this.router.get(
      "/access-code",
      this.configController.getConfiguration("access_code"),
    );
    this.router.put(
      "/access-code",
      this.configController.setConfiguration("access_code"),
    );

    this.router.get(
      "/absence-token",
      this.configController.getConfiguration("absence_token"),
    );
    this.router.put(
      "/absence-token",
      this.configController.setConfiguration("absence_token"),
    );

    return this.router;
  }
}
