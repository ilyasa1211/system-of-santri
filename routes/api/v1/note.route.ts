import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import { IRoute, Route } from ".";
import accountIs from "../../../middlewares/account-is";
import NoteController from "../../../controllers/note.controller";

export default class NoteRoute extends Route implements IRoute {
    public noteController;
    public constructor(public router: Router) {
        super(router);
        this.noteController = new NoteController();
    }
    public registerRoute(): this {
        this.router.use(passport.authenticate("jwt", { session: false }));

        this.router.get("/", this.noteController.index);
        this.router.get("/:id", this.noteController.show);

        this.router.use(accountIs(ROLES.ADMIN, ROLES.MANAGER));

        this.router.post("/", this.noteController.insert);
        this.router.delete("/:id", this.noteController.destroy);
        this.router.put("/:id", this.noteController.update);

        return this;
    }
}
