import { Router } from "express";

import AccountRoute from "./account.route";
import AuthRoute from "./auth.route";
import EventRoute from "./event.route";
import LearningRoute from "./learning.route";
import NoteRoute from "./note.route";
import ResumeRoute from "./resume.route";
import WorkRoute from "./work.route";
// import TrashRoute from "./trash.route";
import ConfigRoute from "./config.route";
import { IRoutes } from "../../../interfaces/interfaces";
import AbsenceRoute from "./absence.route";
import AbsenseController from "../../../controllers/absense";
import Account, { IAccount, IUser } from "../../../models/account.model";
import { HydratedDocument } from "mongoose";
import ApiResponse from "../../../utils/api-response";
import { AccountController } from "../../../controllers/account";
import AccountService from "../../../services/account.service";
import AccountRepository from "../../../repositories/account.repository";
import { Storage } from "../../../configs/storage";
import { AuthController } from "../../../controllers/auth";
import { ConfigurationController } from "../../../controllers/configuration";
import { EventController } from "../../../controllers/event";
import EventRepository from "../../../repositories/event.repository";
import Event from "../../../models/event.model";
import EventService from "../../../services/event.service";
import { LearningController } from "../../../controllers/learning";
import LearningRepository from "../../../repositories/learning.repository";
import Learning from "../../../models/learning.model";
import LearningService from "../../../services/learning.service";
import { ResumeController } from "../../../controllers/resume";
import ResumeRepository from "../../../repositories/resume.repository";
import Resume from "../../../models/resume.model";
import ResumeService from "../../../services/resume.service";
import { WorkController } from "../../../controllers/work";
import WorkRepository from "../../../repositories/work.repository";
import Work from "../../../models/work.model";
import WorkService from "../../../services/work.service";

export default class IndexRoutes implements IRoutes {
  private absenceRoute: IRoutesRouter;
  private accountRoute: IRoutesRouter;
  private authRoute: IRoutesRouter;
  private configRoute: IRoutesRouter;
  private eventRoute: IRoutesRouter;
  private learningRoute: IRoutesRouter;
  private resumeRoute: IRoutesRouter;
  private workRoute: IRoutesRouter;
  public constructor(
    private router: Router,
    storage: Storage,
    apiResponse: ApiResponse,
  ) {
    const accountRepository = new AccountRepository(Account);
    const accountService = new AccountService(accountRepository);

    const eventRespository = new EventRepository(Event);
    const eventService = new EventService(eventRespository);

    const learningRepository = new LearningRepository(Learning);
    const learningService = new LearningService(learningRepository);

    const resumeRepository = new ResumeRepository(Resume);
    const resumeService = new ResumeService(resumeRepository);

    const workRepository = new WorkRepository(Work);
    const workService = new WorkService(workRepository)

    this.absenceRoute = new AbsenceRoute(
      router,
      new AbsenseController(Account, apiResponse),
    );
    this.accountRoute = new AccountRoute(
      router,
      storage,
      new AccountController(accountService, apiResponse),
    );
    this.authRoute = new AuthRoute(
      router,
      storage,
      new AuthController(accountRepository),
    );
    this.configRoute = new ConfigRoute(router, new ConfigurationController());
    this.eventRoute = new EventRoute(
      router,
      new EventController(eventService, apiResponse),
    );
    this.learningRoute = new LearningRoute(
      router,
      storage,
      new LearningController(learningService, apiResponse),
    );
    this.resumeRoute = new ResumeRoute(
      router,
      new ResumeController(resumeService, apiResponse),
    );
    this.workRoute = new WorkRoute(router, new WorkController(workService, apiResponse);
  }

  public registerRoutes(): Router {
    this.router.use("/absence", this.absenceRoute.registerRoutes());
    this.router.use("/account", this.accountRoute.registerRoutes());
    this.router.use("/auth", this.authRoute.registerRoutes());
    this.router.use("/config", this.configRoute.registerRoutes());
    this.router.use("/event", this.eventRoute.registerRoutes());
    this.router.use("/learning", this.learningRoute.registerRoutes());
    this.router.use("/resume", this.resumeRoute.registerRoutes());
    // this.router.use("/trash", this.trashRoute.getRouter());
    this.router.use("/work", this.workRoute.registerRoutes());

    return this.router;
  }
}
