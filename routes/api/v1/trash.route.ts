import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import AccountController from "../../../controllers/account.controller";
import { IRoute, Route } from ".";
import accountIs from "../../../middlewares/account-is";

export default class TrashRoute extends Route implements IRoute {
    public accountController;
    public constructor(public router: Router) {
        super(router);
        this.accountController = new AccountController();
    }

    public registerRoute(): this {
        this.router.use(passport.authenticate("jwt", { session: false }));

        this.router.use(accountIs(ROLES.ADMIN));

        this.router.get("/account", this.accountController.trash);
        this.router.post("/account/:id", this.accountController.restore);
        this.router.delete("/account/:id", this.accountController.eliminate);

        return this;
    }
}
