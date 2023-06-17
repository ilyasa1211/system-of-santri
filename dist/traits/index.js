"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_PATTERNS = exports.STATUSES = exports.ROLES = exports.MONTHS = exports.ATTENDANCE_STATUS = void 0;
var attendance_status_1 = require("./attendance-status");
Object.defineProperty(exports, "ATTENDANCE_STATUS", { enumerable: true, get: function () { return attendance_status_1.ATTENDANCE_STATUS; } });
var month_1 = require("./month");
Object.defineProperty(exports, "MONTHS", { enumerable: true, get: function () { return __importDefault(month_1).default; } });
var role_1 = require("./role");
Object.defineProperty(exports, "ROLES", { enumerable: true, get: function () { return role_1.ROLES; } });
var status_1 = require("./status");
Object.defineProperty(exports, "STATUSES", { enumerable: true, get: function () { return __importDefault(status_1).default; } });
var email_pattern_1 = require("./email-pattern");
Object.defineProperty(exports, "EMAIL_PATTERNS", { enumerable: true, get: function () { return __importDefault(email_pattern_1).default; } });
