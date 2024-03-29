import { Router } from "express";
import passport from "passport";
import { ResumeController } from "../../../controllers/resume";
import { IRoutes } from "../../../interfaces/interfaces";

export default class ResumeRoute implements IRoutes {
  public constructor(
    private router: Router,
    private controller: ResumeController,
  ) {}

  public registerRoutes() {
    this.router.get("/resume", this.controller.index);
    this.router.get("/resume/:accountUniqueId", this.controller.show);

    this.router.use(passport.authenticate("jwt", { session: false }));
    this.router.post("/resume", this.controller.create);
    this.router.delete("/resume/:resumeId", this.controller.destroy);
    this.router.put("/resume/:resumeId", this.controller.update);
  }
}
