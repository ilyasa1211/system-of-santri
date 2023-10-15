import passport from "passport";
import { ROLES } from "../../../enums/role";
import AccountController from "../../../controllers/account.controller";
import { Route } from ".";
import Storage from "../../../configs/multer";
import accountIs from "../../../middlewares/account-is";
export default class AccountRoute extends Route {
    constructor(router) {
        super(router);
        this.router = router;
        this.upload = Storage("account");
        this.accountController = new AccountController();
    }
    registerRoute() {
        this.router.use(this.upload.single("avatar"));
        // Get All Accounts
        this.router.get("/", this.accountController.index);
        // Get information about my account
        this.router.get("/me", passport.authenticate("jwt", { session: false }), this.accountController.myAccount);
        // Show one account
        this.router.get("/:id", this.accountController.show);
        // Get all works about an account
        this.router.get("/:id/work", this.accountController.showWorks);
        // Get a resume of an account
        this.router.get("/:id/resume", this.accountController.showResume);
        // All route below this will work for authenticated user only
        this.router.use(passport.authenticate("jwt", { session: false }));
        // Create an account to the database
        this.router.post("/", accountIs(ROLES.ADMIN), this.accountController.create);
        // Update the existing account
        this.router.put("/:id", this.accountController.update);
        // Delete one account not permanently
        this.router.delete("/:id", this.accountController.disableAccount);
        return this;
    }
}
