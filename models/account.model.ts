import mongoose, { Date, Document, ObjectId } from "mongoose";
import emailPattern from "../traits/email-pattern";
import { ICalendar } from "./calendar.model";

require("./role.model");
require("./resume.model");

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
  role: number | {
    id: ObjectId | string;
    name: string;
  };
  absenses: Array<string>;
  absense: number | ObjectId | ICalendar;
  work: Array<ObjectId>;
  resume: ObjectId;
  verify: boolean;
  verifyExpiration: number;
  forgetToken: string | null;
  hash: string | null;
  deletedAt: Date;
}

const accountSchema = new mongoose.Schema<IAccount>({
  name: {
    type: String,
    required: [true, "To continue, please enter your name."],
  },
  email: {
    type: String,
    maxLength: [
      320, // Email address maximum length
      "Email length is too long. Please type an email address that is no longer than 320 characters.",
    ],
    required: [
      true,
      "Please enter a working email address. Email is a necessary field.",
    ],
    unique: true,
    match: emailPattern,
  },
  password: {
    type: String,
    minLength: [
      8,
      "Please pick a password that is at least 8 characters long for the security of your account.",
    ],
    maxLength: [
      128,
      "Please select a password with a maximum of 128 characters",
    ],
    required: [
      true,
      "To ensure the security of your account, kindly provide a password.",
    ],
  },
  phoneNumber: {
    type: String,
    maxLength: [
      15,
      "Please enter a working phone number up to 15 characters in length.",
    ],
    required: [true, "Please enter a working phone number before continuing."],
  },
  division: {
    type: String,
    required: [true, "Please choose a division to continue."],
  },
  status: {
    type: String,
  },
  avatar: {
    type: String,
    default: "default-avatar.jpg",
  },
  santriPeriod: {
    type: String,
  },
  generation: {
    type: Number,
    default: 15,
  },
  generationYear: {
    type: Number,
    default: 2090,
  },
  role: {
    type: Number,
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
  work: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Work" }],
  resume: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Resume",
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

export const Account = mongoose.model<IAccount>("Account", accountSchema);

export default Account;