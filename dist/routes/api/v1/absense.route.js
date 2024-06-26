import passport from "passport";
import { ROLES } from "../../../enums/role";
import { Route } from ".";
import AccountIs from "../../../middlewares/account-is";
export default class AbsenceRoute extends Route {
  constructor(router) {
    super(router);
    this.router = router;
  }
  registerRoute() {
    this.router.use(passport.authenticate("jwt", { session: false }));
    this.router.get("/me", AbsenceController.me);
    this.router.get("/:id", AbsenceController.show);
    this.router.get(
      "/",
      AccountIs(ROLES.ADMIN, ROLES.MANAGER),
      AbsenceController.index,
    );
    this.router.post("/", AccountIs(ROLES.SANTRI), AbsenceController.insert);
    return this;
  }
}
