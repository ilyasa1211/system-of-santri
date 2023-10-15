import { Router } from "express";
import passport from "passport";
import { IRoute, Route } from ".";
import ResumeController from "../../../controllers/resume.controller";

export default class ResumeRoute extends Route implements IRoute {
    public resumeController;
    public constructor(public router: Router) {
        super(router);
        this.resumeController = new ResumeController();
    }
    public registerRoute(): this {
        this.router.get("/", this.resumeController.index);
        this.router.get("/:accountUniqueId", this.resumeController.show);

        this.router.use(passport.authenticate("jwt", { session: false }));

        this.router.post("/", this.resumeController.insert);
        this.router.delete("/:id", this.resumeController.destroy);
        this.router.put("/:id", this.resumeController.update);
        return this;
    }
}
