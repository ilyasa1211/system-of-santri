import mongoose from "mongoose";

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
    required: [true, "Please choose a division to continue."],
  },
  thumbnail: {
    type: String,
    default: "default-thumbnail.jpg",
  },
  title: {
    type: String,
    required: [true, "Please include the entry's title."],
  },
  content: {
    type: String,
    required: [true, "Enter your entry's content please."],
  },
  goal: {
    type: String,
    default: "",
  },
}, { timestamps: true });

export const Learning = mongoose.model<ILearning>("Learning", learningSchema);

export default Learning;