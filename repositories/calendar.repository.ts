import Calendar from "../models/calendar.model";
import CalendarInterface from "./interfaces/calendar.interface";

export default class CalendarRepository implements CalendarInterface {
    public constructor(private calendarModel: typeof Calendar) {}

    public findAll() {
        return this.calendarModel.find().exec();
    }
    public findById(id: string) {
        return this.calendarModel.findById(id).exec();
    }
    public findByYear(year: number) {
        return this.calendarModel.findOne({ year }).exec();
    }
}
