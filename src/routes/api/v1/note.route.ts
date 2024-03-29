import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import { NoteController } from "../../../controllers/note";
import { accountIs } from "../../../middlewares/account-is";
import { IRoutes } from "../../../interfaces/interfaces";

export default class NoteRoute implements IRoutes {
  public constructor(
    private router: Router,
    private controller: NoteController,
  ) {}
  public registerRoutes() {
    this.router.use(passport.authenticate("jwt", { session: false }));
    this.router.get("/note", this.controller.index);
    this.router.get("/note/:noteId", this.controller.show);

    this.router.use(accountIs(ROLES.ADMIN, ROLES.MANAGER));
    this.router.post("/note", this.controller.create);
    this.router.delete("/note/:noteId", this.controller.destroy);
    this.router.put("/note/:noteId", this.controller.update);
  }
}
