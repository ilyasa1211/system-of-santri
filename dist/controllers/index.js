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
exports.ConfigurationController = exports.EventController = exports.WorkController = exports.ResumeController = exports.AuthController = exports.AbsenceController = exports.LearningController = exports.AccountController = void 0;
exports.AccountController = __importStar(require("./account"));
exports.LearningController = __importStar(require("./learning"));
exports.AbsenceController = __importStar(require("./absence"));
exports.AuthController = __importStar(require("./auth"));
exports.ResumeController = __importStar(require("./resume"));
exports.WorkController = __importStar(require("./work"));
exports.EventController = __importStar(require("./event"));
exports.ConfigurationController = __importStar(require("./configuration"));
