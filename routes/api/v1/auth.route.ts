import { Router } from "express";
import Storage from "../../../configs/multer";
import { IRoute, Route } from ".";
import guestOnly from "../../../middlewares/guest-only";

export default class AuthRoute extends Route implements IRoute {
    public authController;
    public upload;

    public constructor(public router: Router) {
        super(router);
        this.upload = Storage("account");
        this.authController = new AuthController();
    }
    public registerRoute() {
        this.router.use(guestOnly);
        this.router.post("/signin", this.authController.signin);

        this.router.get("/verify", this.authController.verify);
        this.router.get("/re-verify", this.authController.resendVerifyEmail);

        this.router.post(
            "/forgot-password",
            this.authController.forgotPassword,
        );
        this.router.put("/forgot-password", this.authController.resetPassword);

        this.router.use(this.upload.single("photo"));
        this.router.post("/signup", this.authController.signup);
        return this;
    }
}
