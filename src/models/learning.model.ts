import mongoose, { SchemaTypes } from "mongoose";
import path from "path";
import { ResponseMessage } from "../enums/response";

export interface ILearning {
  _id?: string;
  content: string;
  createdAt: string;
  division: string;
  goal: string;
  thumbnail: string;
  title: string;
  updatedAt: string;
}

export const learningSchema = new mongoose.Schema<ILearning>(
  {
    division: {
      type: SchemaTypes.String,
      trim: true,
      required: [true, ResponseMessage.EMPTY_DIVISION],
    },
    thumbnail: {
      type: SchemaTypes.String,
      default: path.join(
        "images",
        String(process.env.SAVE_LEARNING_THUMBNAIL),
        String(process.env.DEFAULT_THUMBNAIL_NAME),
      ),
    },
    title: {
      type: SchemaTypes.String,
      trim: true,
      // TODO: seperate message
      required: [true, "Please include the entry's title."],
    },
    content: {
      type: SchemaTypes.String,
      trim: true,
      required: [true, "Enter your entry's content please."],
    },
    goal: {
      type: SchemaTypes.String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);

const Learning = mongoose.model<ILearning>("Learning", learningSchema);

export default Learning;
