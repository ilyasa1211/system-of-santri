"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const email_pattern_1 = __importDefault(require("../traits/email-pattern"));
const path_1 = __importDefault(require("path"));
const response_1 = require("../traits/response");
require("./role");
require("./resume");
const accountSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "To continue, please enter your name."],
    },
    email: {
        type: String,
        trim: true,
        maxLength: [
            320,
            "Email length is too long. Please type an email address that is no longer than 320 characters.",
        ],
        required: [true, response_1.ResponseMessage.EMPTY_EMAIL],
        unique: true,
        match: email_pattern_1.default,
    },
    password: {
        type: String,
        minLength: [8, response_1.ResponseMessage.WEAK_PASSWORD],
        maxLength: [
            128,
            "Please select a password with a maximum of 128 characters",
        ],
        required: [true, response_1.ResponseMessage.EMPTY_PASSWORD],
    },
    phoneNumber: {
        type: String,
        trim: true,
        maxLength: [
            15,
            "Please enter a working phone number up to 15 characters in length.",
        ],
        required: [
            true,
            "Please enter a working phone number before continuing.",
        ],
    },
    division: {
        type: String,
        trim: true,
        required: [true, "Please choose a division to continue."],
    },
    status: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
        default: path_1.default.join(String(process.env.SAVE_ACCOUNT_AVATAR), String(process.env.DEFAULT_AVATAR_NAME)),
    },
    santriPeriod: {
        type: String,
        trim: true,
    },
    generation: {
        type: Number,
        default: 15,
        trim: true,
    },
    generationYear: {
        type: Number,
        trim: true,
        default: 2090,
    },
    roleId: {
        type: Number,
        trim: true,
        default: 3,
    },
    absenses: {
        type: [String],
    },
    absenseId: {
        type: Number,
        ref: "Absense",
    },
    workId: [{ type: mongoose_1.default.SchemaTypes.ObjectId }],
    resumeId: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        default: null,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verifyExpiration: {
        type: Number,
        default: null,
    },
    forgetToken: {
        type: String,
        default: null,
    },
    hash: {
        type: String,
        default: null,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    // toJSON: { virtuals: true },
});
accountSchema.pre("save", function (next) {
    // abense = 0 is for relation with absense model with id 0
    this.absenseId = 0;
    next();
});
accountSchema.virtual("role", {
    ref: "Role",
    localField: "roleId",
    foreignField: "id",
    justOne: true,
});
accountSchema.virtual("work", {
    ref: "Work",
    localField: "workId",
    foreignField: "_id",
});
accountSchema.virtual("resume", {
    ref: "Resume",
    localField: "resumeId",
    foreignField: "_id",
    justOne: true,
});
exports.Account = mongoose_1.default.model("Account", accountSchema);
exports.default = exports.Account;
