import { Router } from "express";
import { AuthController } from "../../../controllers/auth";
import { IRoutes } from "../../../interfaces/interfaces";
import GuestOnly from "../../../middlewares/guest-only";
import { Storage } from "../../../configs/storage";

export default class AuthRoute implements IRoutes {
  public constructor(
    private router: Router,
    private storage: Storage,
    private controller: AuthController,
  ) {}
  public registerRoutes() {
    this.router.use(GuestOnly);
    this.router.post("/auth/signin", this.controller.signin);
    this.router.get("/auth/verify", this.controller.verify);
    this.router.get("/auth/reverify", this.controller.resendVerifyEmail);
    this.router.post("/auth/forgot-password", this.controller.forgetPassword);
    this.router.put("/auth/forgot-password", this.controller.resetPassword);

    this.router.use(this.storage.local("account").single("photo"));
    this.router.post("/auth/signup", this.controller.signup);

    return this.router;
  }
}
