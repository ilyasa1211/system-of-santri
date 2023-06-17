"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Learning = exports.learningSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.learningSchema = new mongoose_1.default.Schema({
    division: {
        type: String,
        required: [true, "Please choose a division to continue."],
    },
    thumbnail: {
        type: String,
        default: "default-thumbnail.jpg",
    },
    title: {
        type: String,
        required: [true, "Please include the entry's title."],
    },
    content: {
        type: String,
        required: [true, "Enter your entry's content please."],
    },
    goal: {
        type: String,
        default: "",
    },
}, { timestamps: true });
exports.Learning = mongoose_1.default.model("Learning", exports.learningSchema);
exports.default = exports.Learning;
