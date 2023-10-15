import mongoose, { Date, ObjectId } from "mongoose";
import path from "path";
import { ResponseMessage } from "../enums/response";
import Email from "../helpers/email";
import { SchemaTypes } from "mongoose";

export interface IVerify {
    isVerified: boolean;
    verifyExpiration: number | null;
    verifyToken: string | null;
}

export interface IForgetToken {
    forgetToken: string | null;
}

export interface IAccount {
    absenceId: ObjectId;
    avatar: string;
    division: string;
    email: string;
    generation: number;
    generationYear: number;
    name: string;
    password: string;
    phoneNumber: string;
    resumeId: ObjectId;
    roleId: number;
    santriPeriod: string;
    status: string;
    workId: Array<ObjectId>;
    deletedAt: Date;
}

const accountSchema = new mongoose.Schema<IAccount & IVerify & IForgetToken>(
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
            required: [true, ResponseMessage.EMPTY_EMAIL],
            unique: true,
            match: Email.emailPattern,
        },
        password: {
            type: String,
            minLength: [8, ResponseMessage.WEAK_PASSWORD],
            maxLength: [128, ResponseMessage.PASSWORD_MAX],
            required: [true, ResponseMessage.EMPTY_PASSWORD],
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
            default: path.join(
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
        absenceId: {
            type: Number,
            ref: "Absence",
        },
        workId: [{ type: SchemaTypes.ObjectId }],
        resumeId: {
            type: SchemaTypes.ObjectId,
            default: null,
        },
        isVerified: {
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
        verifyToken: {
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

const Account = mongoose.model<IAccount & IVerify & IForgetToken>(
    "Account",
    accountSchema,
);
export default Account;
