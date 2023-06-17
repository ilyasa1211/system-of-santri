import mongoose, { Document } from "mongoose";

export interface ICalendar extends Document {
  id: number;
  year: number;
  months: Record<string, any>;
  updatedAt: string;
  createdAt: string;
}

const calendarSchema = new mongoose.Schema<ICalendar>({
  id: {
    type: Number,
    default: 0,
  },
  year: {
    type: Number,
  },
  months: {
    type: Object,
  },
}, { timestamps: true });

calendarSchema.pre("save", function (next) {
  this.months = require("../utils/calendar")();
  this.year = new Date().getFullYear();
  next();
});

export const Calendar = mongoose.model<ICalendar>("Absense", calendarSchema);

export default Calendar;