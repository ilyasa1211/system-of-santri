import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import AccountController from "../../../controllers/account";
import { IRoute, Route } from "..";
import accountIs from "../../../middlewares/account-is";
import { Facades } from "../../../facades/route";


Route.use(accountIs(ROLES.ADMIN));
Route.get("/resume/account", accountController.trash);
Route.post("/resume/account/:id", accountController.restore);
Route.delete("/resume/account/:id", accountController.eliminate);
