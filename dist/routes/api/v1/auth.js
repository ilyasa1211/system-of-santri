"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const controllers_1 = require("../../../controllers");
const upload = require("../../../config/multer")("account");
const middleware = __importStar(require("../../../middlewares"));
router.use(middleware.guest);
router.post("/signin", controllers_1.AuthController.signin);
router.get("/verify", controllers_1.AuthController.verify);
router.get("/re-verify", controllers_1.AuthController.resendVerifyEmail);
router.post("/forgot-password", controllers_1.AuthController.forgotPassword);
router.put("/forgot-password", controllers_1.AuthController.resetPassword);
router.use(upload.single("photo"));
router.post("/signup", controllers_1.AuthController.signup);
exports.default = router;
