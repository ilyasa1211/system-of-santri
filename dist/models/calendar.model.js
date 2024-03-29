import mongoose from "mongoose";
import getCalendar from "../utils/calendar";
const calendarSchema = new mongoose.Schema(
  {
    id: {
      type: SchemaTypes.Number,
      default: 0,
    },
    year: {
      type: SchemaTypes.Number,
      unique: true,
    },
    months: {
      type: Object,
    },
  },
  { timestamps: true },
);
calendarSchema.pre("save", function (next) {
  this.months = getCalendar();
  this.year = new Date().getFullYear();
  next();
});
export const Calendar = mongoose.model("Absence", calendarSchema);
export default Calendar;
