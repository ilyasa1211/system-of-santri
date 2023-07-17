import mongoose, { ObjectId } from "mongoose";

export interface IWork {
  account_id: ObjectId | string;
  title: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export const workSchema = new mongoose.Schema<IWork>({
  account_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "account",
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Please enter the needed Title to continue."],
  },
  link: {
    type: String,
    trim: true,
    default: null,
  },
}, { timestamps: true });

export const Work = mongoose.model<IWork>("Work", workSchema);

export default Work;