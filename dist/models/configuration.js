"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = exports.configurationSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
exports.configurationSchema = new mongoose_1.default.Schema({
    key: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    value: {
        type: String,
        trim: true,
        default: (0, utils_1.generateToken)(3),
    },
});
exports.Configuration = mongoose_1.default.model("Configuration", exports.configurationSchema);
exports.default = exports.Configuration;
