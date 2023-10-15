import { Router } from "express";
import passport from "passport";
import { IRoute, Route } from ".";
import Storage from "../../../configs/multer";
import LearningController from "../../../controllers/learning.controller";
import accountIs from "../../../middlewares/account-is";
import { ROLES } from "../../../enums/role";

export default class LearningRoute extends Route implements IRoute {
    public learningController;
    public upload;
    public constructor(public router: Router) {
        super(router);
        this.upload = Storage("learning");
        this.learningController = new LearningController();
    }
    public registerRoute(): this {
        this.router.get("/", this.learningController.index);
        this.router.get("/:id", this.learningController.show);

        this.router.use(passport.authenticate("jwt", { session: false }));
        this.router.use(accountIs(ROLES.ADMIN, ROLES.MANAGER));

        this.router.delete("/:id", this.learningController.destroy);

        this.router.use(this.upload.single("thumbnail"));

        this.router.post("/", this.learningController.insert);
        this.router.put("/:id", this.learningController.update);

        return this;
    }
}
