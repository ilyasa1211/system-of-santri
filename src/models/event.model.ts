import mongoose, { SchemaTypes } from "mongoose";
import Email from "../helpers/email";
import { ResponseMessage } from "../enums/response";

export interface IEvent {
  _id?: string;
  date: string;
  slug: string;
  title: string;
}

export const eventSchema = new mongoose.Schema<IEvent>(
  {
    date: {
      type: SchemaTypes.String,
      required: [true, ResponseMessage.EMPTY_EVENT_DATE],
      match: Email.emailPattern,
    },
    title: {
      type: SchemaTypes.String,
      trim: true,
      required: [true, ResponseMessage.EMPTY_EVENT_TITLE],
    },
  },
  { timestamps: true },
);

const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;
