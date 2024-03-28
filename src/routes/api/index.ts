import { Router } from "express";

import AbsenceRoute from "./v1/absence.route";
import AccountRoute from "./v1/account.route";
import AuthRoute from "./v1/auth.route";
import EventRoute from "./v1/event.route";
import LearningRoute from "./v1/learning.route";
import NoteRoute from "./v1/note.route";
import ResumeRoute from "./v1/resume.route";
import WorkRoute from "./v1/work.route";
import TrashRoute from "./v1/trash.route";
import ConfigRoute from "./v1/config.route";

this.router.use("/absence", this.route.AbsenceRoute.getRouter());
this.router.use("/account", this.route.AccountRoute.getRouter());
this.router.use("/auth", this.route.AuthRoute.getRouter());
this.router.use("/config", this.route.ConfigRoute.getRouter());
this.router.use("/event", this.route.EventRoute.getRouter());
this.router.use("/learning", this.route.LearningRoute.getRouter());
this.router.use("/resume", this.route.ResumeRoute.getRouter());
this.router.use("/trash", this.route.TrashRoute.getRouter());
this.router.use("/work", this.route.WorkRoute.getRouter());
