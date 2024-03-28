import { Router } from "express";
import passport from "passport";
import { IRoute, Route } from "..";
import Storage from "../../../configs/storage";
import LearningController from "../../../controllers/learning";
import accountIs from "../../../middlewares/account-is";
import { ROLES } from "../../../enums/role";
import { Facades } from "../../../facades/route";

const upload = Storage("learning");

Route.get("/learning", [LearningController, "index"]);
Route.get("/learning/:id", [LearningController, "show"]);

Route.use(passport.authenticate("jwt", { session: false }));
Route.use(accountIs(ROLES.ADMIN, ROLES.MANAGER));

Route.delete("/learning/:id", [LearningController, "destroy"]);

Route.use(upload.single("thumbnail"));

Route.post("/learning", [LearningController, "insert"]);
Route.put("/learning/:id", [LearningController, "update"]);
