import mongoose from "mongoose";
import getCalendar from "../utils/calendar";
const calendarSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: 0,
    },
    year: {
        type: Number,
        unique: true,
    },
    months: {
        type: Object,
    },
}, { timestamps: true });
calendarSchema.pre("save", function (next) {
    this.months = getCalendar();
    this.year = new Date().getFullYear();
    next();
});
export const Calendar = mongoose.model("Absence", calendarSchema);
export default Calendar;
