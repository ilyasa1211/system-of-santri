import { Router } from "express";

import passport from "passport";
import { ROLES } from "../../../enums/role";
import { IRoute, Route } from "..";
import { Facades } from "../../../facades/route";
import { Middlewares } from "../../../middlewares/account-is";

Route.use(passport.authenticate("jwt", { session: false }));
Route.get("/:id", AbsenceController.show);
Route.get("/", Middlewares.accountIs(ROLES.ADMIN, ROLES.MANAGER), AbsenceController.index);
Route.post("/", accountIs(ROLES.SANTRI), AbsenceController.insert);
