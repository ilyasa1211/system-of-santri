import { Router } from "express";

import passport from "passport";
import { ROLES } from "../../../enums/role";
import { IRoute, Route } from ".";
import accountIs from "../../../middlewares/account-is";

export default class AbsenceRoute extends Route implements IRoute {
    public constructor(public router: Router) {
        super(router);
    }
    public registerRoute() {
        this.router.use(passport.authenticate("jwt", { session: false }));

        this.router.get("/me", AbsenceController.me);
        this.router.get("/:id", AbsenceController.show);

        this.router.get(
            "/",
            accountIs(ROLES.ADMIN, ROLES.MANAGER),
            AbsenceController.index,
        );

        this.router.post(
            "/",
            accountIs(ROLES.SANTRI),
            AbsenceController.insert,
        );
        return this;
    }
}
