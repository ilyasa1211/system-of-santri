import { Router } from "express";
import passport from "passport";
import { IRoute, Route } from "..";
import ResumeController from "../../../controllers/resume";
import { Facades } from "../../../facades/route";

Route.get("/resume", resumeController.index);
Route.get("/resume/:accountUniqueId", resumeController.show);

Route.use(passport.authenticate("jwt", { session: false }));
Route.post("/resume", resumeController.insert);
Route.delete("/resume/:id", resumeController.destroy);
Route.put("/resume/:id", resumeController.update);
