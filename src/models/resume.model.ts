import mongoose, { ObjectId, SchemaTypes } from "mongoose";

export interface IResume {
  _id?: string;
  accountId: ObjectId | string;
  createdAt: string;
  education: string;
  experience: string;
  personalBackground: string;
  technicalSkill: string;
  updatedAt: string;
}

export const resumeSchema = new mongoose.Schema<IResume>(
  {
    accountId: {
      type: SchemaTypes.ObjectId,
      ref: "Account",
    },
    technicalSkill: {
      type: SchemaTypes.String,
      trim: true,
      default: null,
    },
    education: {
      type: SchemaTypes.String,
      trim: true,
      default: null,
    },
    personalBackground: {
      type: SchemaTypes.String,
      trim: true,
      default: null,
    },
    experience: {
      type: SchemaTypes.String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);

const Resume = mongoose.model<IResume>("Resume", resumeSchema);

export default Resume;
