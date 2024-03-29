import passport from "passport";
import { ROLES } from "../../../enums/role";
import { Router } from "express";
import { EventController } from "../../../controllers/event";
import { accountIs } from "../../../middlewares/account-is";
import { IRoutes } from "../../../interfaces/interfaces";

export default class EventRoute implements IRoutes {
  public constructor(
    private router: Router,
    private eventController: EventController,
  ) {}

  public registerRoutes() {
    this.router.get("/event", this.eventController.index);
    this.router.get("/event/calendar", this.eventController.calendar);

    this.router.use(passport.authenticate("jwt", { session: false }));
    this.router.use(accountIs(ROLES.ADMIN));

    this.router.post("/event/", this.eventController.insert);
    this.router.put("/event/:id", this.eventController.update);
    this.router.delete("/event/:id", this.eventController.destroy);
  }
}
