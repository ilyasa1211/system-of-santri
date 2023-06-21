import mongoose from "mongoose";
import path from "path";

export interface ILearning {
  division: string;
  thumbnail: string;
  title: string;
  content: string;
  goal: string;
  createdAt: string;
  updatedAt: string;
}

export const learningSchema = new mongoose.Schema<ILearning>({
  division: {
    type: String,
    trim: true,
    required: [true, "Please choose a division to continue."],
  },
  thumbnail: {
    type: String,
    default: path.join(
      "images",
      String(process.env.SAVE_LEARNING_THUMBNAIL),
      String(process.env.DEFAULT_THUMBNAIL_NAME),
    ),
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Please include the entry's title."],
  },
  content: {
    type: String,
    trim: true,
    required: [true, "Enter your entry's content please."],
  },
  goal: {
    type: String,
    trim: true,
    default: null,
  },
}, { timestamps: true });

export const Learning = mongoose.model<ILearning>("Learning", learningSchema);

export default Learning;
