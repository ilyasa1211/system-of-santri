import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import { Multer } from "multer";
import { Storage } from "../../../configs/storage";
import { AccountController } from "../../../controllers/account";
import { IRoutes } from "../../../interfaces/interfaces";

export default class AccountRoute implements IRoutes {
  public constructor(
    private router: Router,
    private storage: Storage,
    private accountController: AccountController,
  ) {}

  public registerRoutes() {
    this.router.use(this.storage.local("account").single("avatar"));

    // Get All Accounts
    this.router.get("/account", this.accountController.index);

    // Get information about my account
    // this.router.get(
    //     "/me",
    //     passport.authenticate("jwt", { session: false }),
    //     this.accountController.myAccount,
    // );

    // Show one account
    this.router.get("/account/:accountId", this.accountController.show);

    // Get all works about an account
    // this.router.get(
    //   "/account/:accountId/work",
    //   this.accountController.showWorks,
    // );

    // Get a resume of an account
    // this.router.get(
    //   "/account/:accountId/resume",
    //   this.accountController.showResume,
    // );

    // All route below this will work for authenticated user only
    this.router.use(passport.authenticate("jwt", { session: false }));

    // Create an account to the database
    // this.router.post("/", accountIs(ROLES.ADMIN), this.accountController.create);

    // Update the existing account
    this.router.put("/account/:accountId", this.accountController.update);

    // Delete one account not permanently
    this.router.delete("/account/:accountId", this.accountController.disable);
  }
}
