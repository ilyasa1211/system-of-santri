"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.eventSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.eventSchema = new mongoose_1.default.Schema({
    date: {
        type: String,
        required: [true, "A date for the event should be chosen."],
        match: /^\d{4}-\d{2}-\d{2}$/,
    },
    title: {
        type: String,
        trim: true,
        required: [true, "Please enter the event's name."],
    },
}, { timestamps: true });
exports.Event = mongoose_1.default.model("Event", exports.eventSchema);
exports.default = exports.Event;
