"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const email_pattern_1 = __importDefault(require("../enums/email-pattern"));
const path_1 = __importDefault(require("path"));
const response_1 = require("../enums/response");
require("./role");
require("./resume");
const accountSchema = new mongoose_1.default.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, ResponseMessage.EMPTY_NAME],
        },
        email: {
            type: String,
            trim: true,
            maxLength: [320, ResponseMessage.EMAIL_MAX],
            required: [true, response_1.ResponseMessage.EMPTY_EMAIL],
            unique: true,
            match: email_pattern_1.default,
        },
        password: {
            type: String,
            minLength: [8, response_1.ResponseMessage.WEAK_PASSWORD],
            maxLength: [128, ResponseMessage.PASSWORD_MAX],
            required: [true, response_1.ResponseMessage.EMPTY_PASSWORD],
        },
        phoneNumber: {
            type: String,
            trim: true,
            maxLength: [15, ResponseMessage.PHONE_NUMBER_MAX],
            required: [true, ResponseMessage.EMPTY_PHONE_NUMBER],
        },
        division: {
            type: String,
            trim: true,
            required: [true, ResponseMessage.EMPTY_DIVISION],
        },
        status: {
            type: String,
            trim: true,
        },
        avatar: {
            type: String,
            trim: true,
            default: path_1.default.join(
                String(process.env.SAVE_ACCOUNT_AVATAR),
                String(process.env.DEFAULT_AVATAR_NAME),
            ),
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
        absences: {
            type: [String],
        },
        absenceId: {
            type: Number,
            ref: "Absence",
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
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    },
);
accountSchema.pre("save", function (next) {
    // abense = 0 is for relation with absence model with id 0
    this.absenceId = 0;
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
accountSchema.virtual("absence", {
    ref: "Absence",
    localField: "absenceId",
    foreignField: "id",
    justOne: true,
});
exports.Account = mongoose_1.default.model("Account", accountSchema);
exports.default = exports.Account;
