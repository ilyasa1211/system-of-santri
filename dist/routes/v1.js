"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v1_1 = __importDefault(require("./api/v1/"));
class V1 {
    constructor(router) {
        this.router = router;
        this.route = new v1_1.default(router).routes;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.use("/absence", this.route.AbsenceRoute.getRouter());
        this.router.use("/account", this.route.AccountRoute.getRouter());
        this.router.use("/auth", this.route.AuthRoute.getRouter());
        this.router.use("/config", this.route.config);
        this.router.use("/event", this.route.EventRoute.getRouter());
        this.router.use("/learning", this.route.LearningRoute.getRouter());
        this.router.use("/resume", this.route.ResumeRoute.getRouter());
        this.router.use("/test", this.route.test);
        this.router.use("/trash", this.route.trash);
        this.router.use("/work", this.route.WorkRoute.getRouter());
        return this;
    }
    getRouter() {
        return this.router;
    }
}
exports.default = V1;
