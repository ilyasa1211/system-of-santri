"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        required: [
            true,
            response_1.ResponseMessage.EMPTY_EMAIL,
        ],
        unique: true,
        match: email_pattern_1.default,
    },
    password: {
        type: String,
        minLength: [
            8,
            response_1.ResponseMessage.WEAK_PASSWORD,
        ],
        maxLength: [
            128,
            "Please select a password with a maximum of 128 characters",
        ],
        required: [
            true,
            response_1.ResponseMessage.EMPTY_PASSWORD,
        ],
    },
    phoneNumber: {
        type: String,
        trim: true,
        maxLength: [
            15,
            "Please enter a working phone number up to 15 characters in length.",
        ],
        required: [true, "Please enter a working phone number before continuing."],
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
    role: {
        type: Number,
        trim: true,
        default: 3,
        ref: "Role",
    },
    absenses: {
        type: [String],
    },
    absense: {
        type: Number,
        ref: "Absense",
    },
    work: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: "Work" }],
    resume: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Resume",
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
}, { timestamps: true });
accountSchema.pre("save", function (next) {
    // abense = 0 is for relation with absense model with id 0
    this.absense = 0;
    next();
});
accountSchema.methods.deleteAvatar = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // await this.deleteOne();
        debugger;
        // deletePhoto(this.); 
    });
};
exports.Account = mongoose_1.default.model("Account", accountSchema);
exports.default = exports.Account;
