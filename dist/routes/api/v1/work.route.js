import passport from "passport";
import { ROLES } from "../../../enums/role";
import { Route } from ".";
import WorkController from "../../../controllers/work.controller";
import accountIs from "../../../middlewares/account-is";
export default class WorkRoute extends Route {
    constructor(router) {
        super(router);
        this.router = router;
        this.workController = new WorkController();
    }
    registerRoute() {
        this.router.use(passport.authenticate("jwt", { session: false }));
        this.router.get("/", accountIs(ROLES.ADMIN, ROLES.MANAGER), this.workController.index);
        this.router.use(accountIs(ROLES.ADMIN, ROLES.MANAGER, ROLES.SANTRI));
        this.router.post("/", this.workController.insert);
        this.router.put("/:id", this.workController.update);
        this.router.delete("/:id", this.workController.destroy);
        this.router.get("/:id", this.workController.show);
        return this;
    }
}
