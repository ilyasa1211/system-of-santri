import mongoose from "mongoose";

export interface IEvent {
  date: string;
  title: string;
  slug: string;
  updatedAt: string;
  createdAt: string;
}

export const eventSchema = new mongoose.Schema<IEvent>({
  date: {
    type: String,
    required: [true, "A date for the event should be chosen."],
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Please enter the event's name."],
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
  },
}, { timestamps: true });

export const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;