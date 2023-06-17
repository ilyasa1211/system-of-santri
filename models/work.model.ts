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
    required: [true, "For the required field, kindly enter a title."],
  },
  link: {
    type: String,
    default: null,
  },
}, { timestamps: true });

export const Work = mongoose.model<IWork>("Work", workSchema);

export default Work;