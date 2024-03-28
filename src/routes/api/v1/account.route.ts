import { Router } from "express";
import passport from "passport";
import { ROLES } from "../../../enums/role";
import AccountController from "../../../controllers/account";
import { IRoute, Route } from "..";
import Storage from "../../../configs/storage";
import accountIs from "../../../middlewares/account-is";
import { Multer } from "multer";
import { Facades } from "../../../facades/route";


const upload = Storage("account");

Route.use(upload.single("avatar"));

// Get All Accounts
Route.get("/account", [AccountController, "index"]);

// Get information about my account
// Route.get(
//     "/me",
//     passport.authenticate("jwt", { session: false }),
//     AccountController.myAccount,
// );

// Show one account
Route.get("/account/:accountId", [AccountController, "show"]);

// Get all works about an account
Route.get("/account/:accountId/work", [AccountController, "showWorks"]);

// Get a resume of an account
Route.get("/account/:accountId/resume", [AccountController, "showResume"]);

// All route below this will work for authenticated user only
Route.use(passport.authenticate("jwt", { session: false }));

// Create an account to the database
// Route.post("/", accountIs(ROLES.ADMIN), AccountController.create);

// Update the existing account
Route.put("/account/:accountId", [AccountController, "update"]);

// Delete one account not permanently
Route.delete("/account/:accountId", [AccountController, "disable"]);
