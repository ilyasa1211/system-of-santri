import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import { IRoute, Route } from "..";
import ConfigurationController from "../../../controllers/configuration";
import accountIs from "../../../middlewares/account-is";
import { Facades } from "../../../facades/route";

Route.use(passport.authenticate("jwt", { session: false }));
Route.use(accountIs(ROLES.ADMIN, ROLES.MANAGER));

Route.get("/access-code", configController.getConfiguration("Access Code"));
Route.put("/access-code", configController.setConfiguration("Access Code"));

Route.get("/absence-token", configController.getConfiguration("Absence Token"));
Route.put("/absence-token", configController.setConfiguration("Absence Token"));
