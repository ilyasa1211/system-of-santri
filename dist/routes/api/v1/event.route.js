import passport from "passport";
import { ROLES } from "../../../enums/role";
import { Route } from ".";
import accountIs from "../../../middlewares/account-is";
import EventController from "../../../controllers/event.controller";
export default class EventRoute extends Route {
    constructor(router) {
        super(router);
        this.router = router;
        this.eventController = new EventController();
    }
    registerRoute() {
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
