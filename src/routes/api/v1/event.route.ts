import passport from "passport";
import { ROLES } from "../../../enums/role";
import { Router } from "express";
import { EventController } from "../../../controllers/event";
import { IRoutes } from "../../../interfaces/interfaces";
import AccountIs from "../../../middlewares/account-is";

export default class EventRoute implements IRoutes {
  public constructor(
    private router: Router,
    private eventController: EventController,
  ) {}

  public registerRoutes() {
    this.router.get("/event", this.eventController.index);
    this.router.get("/event/calendar", this.eventController.calendar);

    this.router.use(passport.authenticate("jwt", { session: false }));
    this.router.use(AccountIs(ROLES.ADMIN));

    this.router.post("/event/", this.eventController.insert);
    this.router.put("/event/:id", this.eventController.update);
    this.router.delete("/event/:id", this.eventController.destroy);

    return this.router;
  }
}
