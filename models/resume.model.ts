import mongoose, { ObjectId } from "mongoose";

export interface IResume {
  account_id: ObjectId | string;
  technical_skill: string;
  education: string;
  personal_background: string;
  experience: string;
  createdAt: string;
  updatedAt: string;
}

export const resumeSchema = new mongoose.Schema<IResume>({
  account_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Account",
  },
  technical_skill: {
    type: String,
    default: "",
  },
  education: {
    type: String,
    default: "",
  },
  personal_background: {
    type: String,
    default: "",
  },
  experience: {
    type: String,
    default: "",
  },
}, { timestamps: true });

export const Resume = mongoose.model<IResume>("Resume", resumeSchema);

export default Resume;