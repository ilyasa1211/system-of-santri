import passport from "passport";
import { ROLES } from "../../../enums/role";
import { IRoute, Route } from ".";
import accountIs from "../../../middlewares/account-is";
import { Router } from "express";
import EventController from "../../../controllers/event.controller";

export default class EventRoute extends Route implements IRoute {
    public eventController;
    public constructor(public router: Router) {
        super(router);
        this.eventController = new EventController();
    }
    public registerRoute(): this {
        this.router.get("/", this.eventController.index);
        this.router.get("/calendar", this.eventController.calendar);

        this.router.use(passport.authenticate("jwt", { session: false }));

        this.router.use(accountIs(ROLES.ADMIN));
        this.router.post("/", this.eventController.insert);
        this.router.put("/:id", this.eventController.update);
        this.router.delete("/:id", this.eventController.destroy);

        return this;
    }
}
