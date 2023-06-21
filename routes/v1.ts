import { Router } from "express";
import * as route from "./api/v1";

const router: Router =  Router();

export default router;

router.use("/absense", route.absense);
router.use("/account", route.account);
router.use("/auth", route.auth);
router.use("/learning", route.learning);
router.use("/work", route.work);
router.use("/resume", route.resume);
router.use("/event", route.event);
router.use("/trash", route.trash);
router.use("/test", route.test);
router.use("/config", route.config);
