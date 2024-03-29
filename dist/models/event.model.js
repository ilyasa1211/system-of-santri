import mongoose from "mongoose";
import Email from "../helpers/email";
import { ResponseMessage } from "../enums/response";
export const eventSchema = new mongoose.Schema(
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
const Event = mongoose.model("Event", eventSchema);
export default Event;
