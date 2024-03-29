import { Router } from "express";
import { AuthController } from "../../../controllers/auth";
import { IRoutes } from "../../../interfaces/interfaces";
import guestOnly from "../../../middlewares/guest-only";

export default class AuthRoute implements IRoutes {
  public constructor(
    private router: Router,
    private storage: Storage,
    private authController: AuthController,
  ) {}
  public registerRoutes() {
    this.router.use(guestOnly);
    this.router.post("/auth/signin", this.authController.signin);
    this.router.get("/auth/verify", this.authController.verify);
    this.router.get("/auth/reverify", this.authController.resendVerifyEmail);
    this.router.post(
      "/auth/forgot-password",
      this.authController.forgetPassword,
    );
    this.router.put("/auth/forgot-password", this.authController.resetPassword);

    this.router.use(this.storage.local("account").single("photo"));
    this.router.post("/auth/signup", this.authController.signup);
  }
}
