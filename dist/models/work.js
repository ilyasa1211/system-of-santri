"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Work = exports.workSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.workSchema = new mongoose_1.default.Schema({
    account_id: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "account",
    },
    title: {
        type: String,
        trim: true,
        required: [true, "For the required field, kindly enter a title."],
    },
    link: {
        type: String,
        trim: true,
        default: null,
    },
}, { timestamps: true });
exports.Work = mongoose_1.default.model("Work", exports.workSchema);
exports.default = exports.Work;
