import mongoose, { Document } from "mongoose";
import getCalendar from "../utils/calendar";

export interface ICalendar extends Document {
	id: number;
	year: number;
	months: Record<string, any>;
	updatedAt: string;
	createdAt: string;
}

const calendarSchema = new mongoose.Schema<ICalendar>(
	{
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
	},
	{ timestamps: true }
);

calendarSchema.pre("save", function (next) {
	this.months = getCalendar();
	this.year = new Date().getFullYear();
	next();
});

export const Calendar = mongoose.model<ICalendar>("Absense", calendarSchema);

export default Calendar;
