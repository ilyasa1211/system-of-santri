import CalendarInterface from "./interfaces/calendar.interface";

export default class CalendarRepository implements CalendarInterface {
    public constructor(private calendarModel: typeof Calendar) {}

    public async findAll() {
        return await this.calendarModel.find().exec();
    }
    public async findById(id: string) {
        return await this.calendarModel.findById(id).exec();
    }
    public async findByYear(year: number) {
        return await this.calendarModel.findOne({ year }).exec();
    }
}
