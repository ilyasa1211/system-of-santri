import { Router } from "express";
import passport from "passport";
import { LearningController } from "../../../controllers/learning";
import { ROLES } from "../../../enums/role";
import { accountIs } from "../../../middlewares/account-is";
import { IRoutes } from "../../../interfaces/interfaces";

export default class LearningRoute implements IRoutes {
  public constructor(
    private router: Router,
    private storage: Storage,
    private controller: LearningController,
  ) {}

  public registerRoutes() {
    this.router.get("/learning", this.controller.index);
    this.router.get("/learning/:learningId", this.controller.show);

    this.router.use(passport.authenticate("jwt", { session: false }));
    this.router.use(accountIs(ROLES.ADMIN, ROLES.MANAGER));

    this.router.delete("/learning/:learningId", this.controller.destroy);

    this.router.use(this.storage.local("learning").single("thumbnail"));

    this.router.post("/learning", this.controller.create);
    this.router.put("/learning/:", this.controller.update);
  }
}
