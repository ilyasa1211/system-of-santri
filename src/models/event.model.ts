import mongoose from "mongoose";
import Email from "../helpers/email";
import { ResponseMessage } from "../enums/response";

export interface IEvent {
    date: string;
    slug: string;
    title: string;
}

export const eventSchema = new mongoose.Schema<IEvent>(
    {
        date: {
            type: String,
            required: [true, ResponseMessage.EMPTY_EVENT_DATE],
            match: Email.emailPattern,
        },
        title: {
            type: String,
            trim: true,
            required: [true, ResponseMessage.EMPTY_EVENT_TITLE],
        },
    },
    { timestamps: true },
);

const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;
