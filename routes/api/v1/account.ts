import { Router } from "express";
import { AccountController } from "../../../controllers";
import passport from "passport";
import * as middleware from "../../../middlewares";
import { ROLES } from "../../../traits/role";

const upload = require("../../../configs/multer")("account");
const router: Router =  Router();

router.use(upload.single("avatar"));

// Get All Accounts
router.get("/", AccountController.index);

// Get information about my account
router.get("/me", passport.authenticate("jwt", { session: false }), AccountController.profile);

// Show one account
router.get("/:id", AccountController.show);

// Get all works about an account
router.get("/:id/work", AccountController.workIndex);

// Get a work about an account
router.get("/:id/work/:workId", AccountController.workShow);

// Get a resume of an account
router.get("/:id/resume", AccountController.resume);

// All route below this will work for authenticated user only
router.use(passport.authenticate("jwt", { session: false }));

// Create an account to the database
router.post("/", middleware.accountIs(ROLES.ADMIN), AccountController.insert);

// Update the existing account
router.put("/:id", AccountController.update);

// Delete one account not permanently
router.delete("/:id", AccountController.destroy);

export default router;
