import passport from "passport";
import { ROLES } from "../../../enums/role";
import { IRoute, Route } from "..";
import accountIs from "../../../middlewares/account-is";
import { Router } from "express";
import EventController from "../../../controllers/event";
import { Facades } from "../../../facades/route";


Route.get("/event", [EventController, "index"]);
Route.get("/event/calendar", [EventController, "calendar"]);

Route.use(passport.authenticate("jwt", { session: false }));
Route.use(accountIs(ROLES.ADMIN));

Route.post("/event/", [EventController, "insert"]);
Route.put("/event/:id", [EventController, "update"]);
Route.delete("/event/:id", [EventController, "destroy"]);

