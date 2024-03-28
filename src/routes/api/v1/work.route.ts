import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import { IRoute, Route } from "..";
import WorkController from "../../../controllers/work";
import accountIs from "../../../middlewares/account-is";
import { Facades } from "../../../facades/route";

Route.use(passport.authenticate("jwt", { session: false }));
Route.get(
    "/work",
    accountIs(ROLES.ADMIN, ROLES.MANAGER),
    workController.index,
);

Route.use(accountIs(ROLES.ADMIN, ROLES.MANAGER, ROLES.SANTRI));
Route.post("/work", workController.insert);
Route.put("/work/:id", workController.update);
Route.delete("/work/:id", workController.destroy);
Route.get("/work/:id", workController.show);
