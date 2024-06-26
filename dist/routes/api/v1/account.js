"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", {
          enumerable: true,
          value: v,
        });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../../controllers");
const passport_1 = __importDefault(require("passport"));
const middleware = __importStar(require("../../../middlewares"));
const role_1 = require("../../../enums/role");
const upload = require("../../../configs/multer")("account");
const router = (0, express_1.Router)();
router.use(upload.single("avatar"));
// Get All Accounts
router.get("/", controllers_1.AccountController.index);
// Get information about my account
router.get(
  "/me",
  passport_1.default.authenticate("jwt", { session: false }),
  controllers_1.AccountController.profile,
);
// Show one account
router.get("/:id", controllers_1.AccountController.show);
// Get all works about an account
router.get("/:id/work", controllers_1.AccountController.workIndex);
// Get a work about an account
router.get("/:id/work/:workId", controllers_1.AccountController.workShow);
// Get a resume of an account
router.get("/:id/resume", controllers_1.AccountController.resume);
// All route below this will work for authenticated user only
router.use(passport_1.default.authenticate("jwt", { session: false }));
// Create an account to the database
router.post(
  "/",
  middleware.AccountIs(role_1.ROLES.ADMIN),
  controllers_1.AccountController.insert,
);
// Update the existing account
router.put("/:id", controllers_1.AccountController.update);
// Delete one account not permanently
router.delete("/:id", controllers_1.AccountController.destroy);
exports.default = router;
