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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const middleware = __importStar(require("../../../middlewares"));
const multer_1 = __importDefault(require("../../../configs/multer"));
const controllers_1 = require("../../../controllers");
const role_1 = require("../../../traits/role");
const router = (0, express_1.Router)();
router.get("/", controllers_1.LearningController.index);
router.get("/:id", controllers_1.LearningController.show);
router.use(passport_1.default.authenticate("jwt", { session: false }));
router.use(middleware.accountIs(role_1.ROLES.ADMIN, role_1.ROLES.MANAGER));
router.delete("/:id", controllers_1.LearningController.destroy);
router.use((0, multer_1.default)(String(process.env.SAVE_LEARNING_THUMBNAIL)).single("thumbnail"));
router.post("/", controllers_1.LearningController.insert);
router.put("/:id", controllers_1.LearningController.update);
exports.default = router;
