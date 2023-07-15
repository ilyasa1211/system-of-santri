

import { Router } from "express";
const router: Router =  Router();

import { AuthController } from "../../../controllers";
const upload = require("../../../configs/multer")("account");
import * as middleware from "../../../middlewares";

router.use(middleware.guest);
router.post("/signin", AuthController.signin);

router.get("/verify", AuthController.verify);
router.get("/re-verify", AuthController.resendVerifyEmail);

router.post("/forgot-password", AuthController.forgotPassword);
router.put("/forgot-password", AuthController.resetPassword);

router.use(upload.single("photo"));
router.post("/signup", AuthController.signup);

export default router;
