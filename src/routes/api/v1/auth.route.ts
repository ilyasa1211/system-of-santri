import { Router } from "express";
import Storage from "../../../configs/storage";
import { IRoute, Route } from "..";
import AuthController from "../../../controllers/auth";
import { Facades } from "../../../facades/route";

const upload = Storage("account");

Route.use(guestOnly);
Route.post("/auth/signin", [AuthController, "signin"]);
Route.get("/auth/verify", [AuthController, "verify"]);
Route.get("/auth/reverify", [AuthController, "resendVerifyEmail"]);
Route.post("/auth/forgot-password", [AuthController, "forgetPassword"]);
Route.put("/auth/forgot-password", [AuthController, "resetPassword"]);

Route.use(upload.single("photo"));
Route.post("/auth/signup", [AuthController, "signup"]);

