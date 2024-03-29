import Storage from "../../../configs/multer";
import { Route } from ".";
import GuestOnly from "../../../middlewares/guest-only";
export default class AuthRoute extends Route {
  constructor(router) {
    super(router);
    this.router = router;
    this.upload = Storage("account");
    this.authController = new AuthController();
  }
  registerRoute() {
    this.router.use(GuestOnly);
    this.router.post("/signin", this.authController.signin);
    this.router.get("/verify", this.authController.verify);
    this.router.get("/re-verify", this.authController.resendVerifyEmail);
    this.router.post("/forgot-password", this.authController.forgotPassword);
    this.router.put("/forgot-password", this.authController.resetPassword);
    this.router.use(this.upload.single("photo"));
    this.router.post("/signup", this.authController.signup);
    return this;
  }
}
