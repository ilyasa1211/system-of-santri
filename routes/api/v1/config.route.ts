import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import { IRoute, Route } from ".";
import ConfigurationController from "../../../controllers/configuration.controller";
import accountIs from "../../../middlewares/account-is";

export default class ConfigRoute extends Route implements IRoute {
    private configController;
    public constructor(public router: Router) {
        super(router);
        this.configController = new ConfigurationController();
    }
    public registerRoute(): this {
        this.router.use(passport.authenticate("jwt", { session: false }));
        this.router.use(accountIs(ROLES.ADMIN, ROLES.MANAGER));

        this.router.get(
            "/access-code",
            this.configController.getConfiguration("Access Code"),
        );
        this.router.put(
            "/access-code",
            this.configController.setConfiguration("Access Code"),
        );

        this.router.get(
            "/absence-token",
            this.configController.getConfiguration("Absence Token"),
        );
        this.router.put(
            "/absence-token",
            this.configController.setConfiguration("Absence Token"),
        );

        return this;
    }
}
