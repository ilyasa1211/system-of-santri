import mongoose, { Date, Document, ObjectId } from "mongoose";
import emailPattern from "../traits/email-pattern";
import { ICalendar } from "./calendar";
import path from "path";
import { ResponseMessage } from "../traits/response";
import { IResume } from "./resume";
import { IWork } from "./work";
import { IRole } from "./role";

require("./role");
require("./resume");

export interface IAccount extends Document {
	id: ObjectId | string;
	name: string;
	email: string;
	password: string;
	phoneNumber: string;
	division: string;
	status: string;
	avatar: string;
	santriPeriod: string;
	generation: number;
	generationYear: number;
	roleId:
		| number
		| {
				id: ObjectId | string;
				name: string;
		  };
	role: IRole;
	absenses: Array<string>;
	absenseId: number | ObjectId | ICalendar;
	absense: ICalendar;
	workId: Array<ObjectId>;
	work: Array<IWork>;
	resumeId: ObjectId;
	resume: IResume;
	verify: boolean;
	verifyExpiration: number;
	forgetToken: string | null;
	hash: string | null;
	deletedAt: Date;
}

const accountSchema = new mongoose.Schema<IAccount>(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "To continue, please enter your name."],
		},
		email: {
			type: String,
			trim: true,
			maxLength: [
				320, // Email address maximum length
				"Email length is too long. Please type an email address that is no longer than 320 characters.",
			],
			required: [true, ResponseMessage.EMPTY_EMAIL],
			unique: true,
			match: emailPattern,
		},
		password: {
			type: String,
			minLength: [8, ResponseMessage.WEAK_PASSWORD],
			maxLength: [
				128,
				"Please select a password with a maximum of 128 characters",
			],
			required: [true, ResponseMessage.EMPTY_PASSWORD],
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
			default: path.join(
				String(process.env.SAVE_ACCOUNT_AVATAR),
				String(process.env.DEFAULT_AVATAR_NAME)
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
		absenses: {
			type: [String],
		},
		absenseId: {
			type: Number,
			ref: "Absense",
		},
		workId: [{ type: mongoose.SchemaTypes.ObjectId }],
		resumeId: {
			type: mongoose.SchemaTypes.ObjectId,
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
		// toJSON: { virtuals: true },
	}
);

accountSchema.pre("save", function (next: any) {
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

export const Account = mongoose.model<IAccount>("Account", accountSchema);

export default Account;
