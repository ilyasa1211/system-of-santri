import passport from "passport";
import { Route } from ".";
import Storage from "../../../configs/multer";
import LearningController from "../../../controllers/learning.controller";
import AccountIs from "../../../middlewares/account-is";
import { ROLES } from "../../../enums/role";
export default class LearningRoute extends Route {
  constructor(router) {
    super(router);
    this.router = router;
    this.upload = Storage("learning");
    this.learningController = new LearningController();
  }
  registerRoute() {
    this.router.get("/", this.learningController.index);
    this.router.get("/:id", this.learningController.show);
    this.router.use(passport.authenticate("jwt", { session: false }));
    this.router.use(AccountIs(ROLES.ADMIN, ROLES.MANAGER));
    this.router.delete("/:id", this.learningController.destroy);
    this.router.use(this.upload.single("thumbnail"));
    this.router.post("/", this.learningController.insert);
    this.router.put("/:id", this.learningController.update);
    return this;
  }
}
