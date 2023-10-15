import passport from "passport";
import { Route } from ".";
import ResumeController from "../../../controllers/resume.controller";
export default class ResumeRoute extends Route {
    constructor(router) {
        super(router);
        this.router = router;
        this.resumeController = new ResumeController();
    }
    registerRoute() {
        this.router.get("/", this.resumeController.index);
        this.router.get("/:accountUniqueId", this.resumeController.show);
        this.router.use(passport.authenticate("jwt", { session: false }));
        this.router.post("/", this.resumeController.insert);
        this.router.delete("/:id", this.resumeController.destroy);
        this.router.put("/:id", this.resumeController.update);
        return this;
    }
}
