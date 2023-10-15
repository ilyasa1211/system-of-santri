import { Router } from "express";

import AbsenceRoute from "./absence.route";
import AccountRoute from "./account.route";
import AuthRoute from "./auth.route";
import EventRoute from "./event.route";
import LearningRoute from "./learning.route";
import NoteRoute from "./note.route";
import ResumeRoute from "./resume.route";
import WorkRoute from "./work.route";
import TrashRoute from "./trash.route";
import ConfigRoute from "./config.route";
export default class V1Route implements APIVersion {
    public route;
    public constructor(public router: Router) {
        this.route = {
            AbsenceRoute: new AbsenceRoute(router),
            AccountRoute: new AccountRoute(router),
            AuthRoute: new AuthRoute(router),
            ConfigRoute: new ConfigRoute(router),
            EventRoute: new EventRoute(router),
            LearningRoute: new LearningRoute(router),
            NoteRoute: new NoteRoute(router),
            ResumeRoute: new ResumeRoute(router),
            TrashRoute: new TrashRoute(router),
            WorkRoute: new WorkRoute(router),
        };
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.use("/absence", this.route.AbsenceRoute.getRouter());
        this.router.use("/account", this.route.AccountRoute.getRouter());
        this.router.use("/auth", this.route.AuthRoute.getRouter());
        this.router.use("/config", this.route.ConfigRoute.getRouter());
        this.router.use("/event", this.route.EventRoute.getRouter());
        this.router.use("/learning", this.route.LearningRoute.getRouter());
        this.router.use("/resume", this.route.ResumeRoute.getRouter());
        this.router.use("/trash", this.route.TrashRoute.getRouter());
        this.router.use("/work", this.route.WorkRoute.getRouter());

        return this;
    }

    public getRouter() {
        return this.router;
    }
}
export interface IRoute {
    router: Router;
    registerRoute: () => this;
    getRouter: () => Router;
    // [k: string]: any;
}

export abstract class Route implements IRoute {
    public constructor(public router: Router) {}
    public abstract registerRoute(): this;
    public getRouter() {
        return this.router;
    }
}

export interface APIVersion {
    router: Router;
    route: any;
    initializeRoutes: () => this;
    getRouter: () => Router;
}
