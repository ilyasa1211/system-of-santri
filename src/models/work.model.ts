import mongoose, { ObjectId, SchemaTypes } from "mongoose";
import { ResponseMessage } from "../enums/response";

export interface IWork {
  _id?: string;
  accountId: ObjectId | string;
  createdAt: string;
  link: string;
  title: string;
  updatedAt: string;
  verifyAt: string;
}

export const workSchema = new mongoose.Schema<IWork>(
  {
    accountId: {
      type: SchemaTypes.ObjectId,
      ref: "Account",
    },
    title: {
      type: SchemaTypes.String,
      trim: true,
      required: [true, ResponseMessage.EMPTY_WORK_TITLE],
    },
    verifyAt: {
      type: SchemaTypes.String,
      default: null,
    },
    link: {
      type: SchemaTypes.String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);

const Work = mongoose.model<IWork>("Work", workSchema);

export default Work;
