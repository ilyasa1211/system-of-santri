import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import { IRoute, Route } from "..";
import accountIs from "../../../middlewares/account-is";
import NoteController from "../../../controllers/note";
import { Facades } from "../../../facades/route";

Route.use(passport.authenticate("jwt", { session: false }));
Route.get("/note", noteController.index);
Route.get("/note/:id", noteController.show);

Route.use(accountIs(ROLES.ADMIN, ROLES.MANAGER));
Route.post("/note", noteController.insert);
Route.delete("/note/:id", noteController.destroy);
Route.put("/note/:id", noteController.update);

